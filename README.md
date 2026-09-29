# AWS SSM Parameter Manager

A small Node.js + Express web application for managing AWS Systems Manager Parameter Store.

## Features

- List all parameters recursively under an SSM path
- Search by parameter name, value, or type
- See decrypted values, including `SecureString`
- Add a new parameter
- Update an existing parameter
- Delete a parameter with confirmation
- Choose an SSM path
- Optionally choose an AWS Region from the UI
- JSON API: `GET /api/v1/ssm`

## 1. Requirements

- Node.js 18+ (Node 20+ recommended)
- AWS credentials with SSM permissions

Required IAM actions for the full UI:

```text
ssm:GetParametersByPath
ssm:PutParameter
ssm:DeleteParameter
```

For encrypted `SecureString` values you may also need permission to decrypt using the relevant KMS key.

## 2. Install

```bash
npm install
```

## 3. Create .env

Windows CMD:

```cmd
copy .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

`AWS_REGION` is optional. You can leave it blank and use your AWS profile/config, or enter the region in the web UI.

## 4. Configure AWS credentials

A simple local option is:

```bash
aws configure
```

The AWS SDK can also use normal environment variables, AWS profiles, or an IAM role when running in AWS.

## 5. Run

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4000/ssm
```

## How to use

### View

Enter an SSM path such as:

```text
/PATH_NAME/
```

Optionally enter a region such as:

```text
ap-south-1
```

Click **Load**.

### Add

Fill in:

- Parameter Name
- Type (`String`, `StringList`, or `SecureString`)
- Value
- Optional description

Click **Add Parameter**.

### Update

Click **Edit** in the table. The current name, value, and type are copied into the form. Change the value and click **Update Parameter**.

### Delete

Click **Delete**. The browser asks for confirmation before deleting.

### Search

Use the search box above the table. It filters locally by parameter name, value, or type.

## JSON API

```text
GET /api/v1/ssm?path=/PATH_NAME/&region=ap-south-1
```

## Security warning

This tool requests SSM parameters with decryption enabled and displays their values. Do not expose it directly to the public internet. It binds to `127.0.0.1` by default. If you deploy it for a team, add authentication, authorization, HTTPS, audit logging, and CSRF protection.
