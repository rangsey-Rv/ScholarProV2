variable "project_id" {
  description = "Google Cloud project ID where the infrastructure will be deployed."
  type        = string
}

variable "region" {
  description = "Google Cloud region for the application and container registry."
  type        = string
  default     = "asia-southeast1"
}

variable "backend_image" {
  description = "Container image used for the backend service."
  type        = string
  default     = "ghcr.io/example/scholarpro-backend:latest"
}

variable "frontend_image" {
  description = "Container image used for the frontend service."
  type        = string
  default     = "ghcr.io/example/scholarpro-frontend:latest"
}

variable "notification_channels" {
  description = "List of Cloud Monitoring notification channel IDs to notify when alerts fire."
  type        = list(string)
  default     = []
}
