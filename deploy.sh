#!/bin/bash -eux

if [ "$#" -eq 0 ]; then
  echo "usage: $0 <S3 bucket name for archive upload> <cloudformation stack name>"
  exit 1
fi

aws cloudformation package --template-file cloudformation.template.yml --output-template-file cloudformation.yml --s3-bucket "$1"> /dev/null
aws cloudformation deploy --template-file cloudformation.yml --capabilities CAPABILITY_NAMED_IAM --stack-name "$2" --parameter-overrides $(cat parameter.conf)
