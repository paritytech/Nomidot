{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "nodewatcher.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create unified labels for nodewatcher components
*/}}
{{- define "nodewatcher.common.matchLabels" -}}
app: {{ template "nodewatcher.name" . }}
release: {{ .Release.Name }}
chain: {{ .Values.chainName }}
{{- end -}}

{{- define "nodewatcher.common.metaLabels" -}}
chart: {{ .Chart.Name }}-{{ .Chart.Version }}
heritage: {{ .Release.Service }}
{{- end -}}

{{- define "nodewatcher.server.labels" -}}
{{ include "nodewatcher.server.matchLabels" . }}
{{ include "nodewatcher.common.metaLabels" . }}
{{- end -}}

{{- define "nodewatcher.server.matchLabels" -}}
{{ include "nodewatcher.common.matchLabels" . }}
{{- end -}}

{{- define "nodewatcher.server.selectorLabels" -}}
component: {{ .Values.server.name }}
{{- end -}}

{{- define "nodewatcher.nodewatcher.labels" -}}
{{ include "nodewatcher.nodewatcher.matchLabels" . }}
{{ include "nodewatcher.common.metaLabels" . }}
{{- end -}}

{{- define "nodewatcher.nodewatcher.matchLabels" -}}
component: {{ .Values.nodewatcher.name }}
{{ include "nodewatcher.common.matchLabels" . }}
{{- end -}}

{{- define "nodewatcher.nodewatcher.selectorLabels" -}}
component: {{ .Values.nodewatcher.name }}
{{- end -}}

{{/*  
Config for Prisma
*/}}

{{- define "nodewatcher.prisma-config" -}}
port: 4466
databases:
  {{ .Values.nodewatcher.dbName }}:
    connector: postgres
    host: 127.0.0.1
    port: 5432
    user: {{ .Values.nodewatcher.dbUser }}
    password: {{ .Values.nodewatcher.dbPassword }}
    migrations: true
    connectionLimit: 5
    rawAccess: true
{{- end -}}
