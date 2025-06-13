provider "aws" {
  region = "us-east-1"
}

// Data sources to get Availability Zones
data "aws_availability_zones" "available" {}

// --- VPC and Networking ---
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "devops-vpc"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "devops-igw"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  cidr_block              = "10.0.${100 + count.index}.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name = "devops-public-subnet-${count.index + 1}"
  }
}

// --- EKS Cluster ---
resource "aws_eks_cluster" "main" {
  name     = "devops-cluster"
  role_arn = "arn:aws:iam::216989113468:role/eksClusterRole" // IMPORTANT: Replace with your EKS Cluster IAM Role ARN

  vpc_config {
    subnet_ids              = [for s in aws_subnet.public : s.id]
    endpoint_public_access  = true
  }

  depends_on = [aws_internet_gateway.gw]
}

// --- EKS Node Group (for worker nodes) ---
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "devops-node-group"
  node_role_arn   = "arn:aws:iam::216989113468:role/eksNodegroupRole" // IMPORTANT: Replace with your EKS Node Group IAM Role ARN
  subnet_ids      = [for s in aws_subnet.public : s.id]
  instance_types  = ["t3.medium"]

  scaling_config {
    desired_size = 2 // Start with 2 nodes
    max_size     = 4 // Scale up to 4 nodes
    min_size     = 2 // Scale down to 2 nodes
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [aws_eks_cluster.main]
}
