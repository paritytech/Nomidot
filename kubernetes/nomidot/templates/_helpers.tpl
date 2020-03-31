{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "nomidot.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nomidot.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "nomidot.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "nomidot.labels" -}}
chart: {{ include "nomidot.chart" . }}
{{ include "nomidot.selectorLabels" . }}
{{- if .Chart.AppVersion }}
version: {{ .Chart.AppVersion | quote }}
{{- end }}
managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "nomidot.selectorLabels" -}}
app: {{ include "nomidot.name" . }}
{{- end -}}

{{/*
Create unified labels for nomidot components
*/}}

{{- define "nomidot.frontend.labels" -}}
{{ include "nomidot.selectorLabels" . }}
{{- end -}}

{{- define "nomidot.frontend.matchLabels" -}}
component: {{ .Values.frontend.name | quote }}
{{ include "nomidot.selectorLabels" . }}
{{- end -}}

{{- define "nomidot.frontend.fullname" -}}
{{- if .Values.frontend.fullnameOverride -}}
{{- .Values.frontend.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- printf "%s-%s" .Release.Name .Values.frontend.name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s-%s" .Release.Name $name .Values.frontend.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}
  
{{/*  
Config for Prisma
*/}}
{{- define "nodewatcher.prisma-config" }}
port: 4466
databases:
  default:
    connector: postgres
    host: 127.0.0.1
    user: {{ .Values.nodewatcher.dbUser }}
    password: {{ .Values.nodewatcher.dbPassword }}
    rawAccess: true
    port: 5432
    migrations: true
    connectionLimit: 5
{{- end }}
