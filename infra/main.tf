provider "aws" {
  region = "eu-west-3"
}

resource "aws_s3_bucket" "react_app" {
  bucket = "thomasfififi"
  force_destroy = true

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = {
    Name = "ReactApp"
  }
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.react_app.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.react_app.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI pour mon React App"
}

resource "aws_s3_bucket_policy" "cloudfront_access" {
  bucket = aws_s3_bucket.react_app.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        },
        Action   = "s3:GetObject",
        Resource = "${aws_s3_bucket.react_app.arn}/*"
      }
    ]
  })
}


resource "aws_cloudfront_distribution" "react_app" {
  origin {
    domain_name = aws_s3_bucket.react_app.bucket_regional_domain_name
    origin_id   = "S3-quentpaqetcosco"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-quentpaqetcosco"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100" # Europe + USA

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "ReactApp CloudFront"
  }
}
