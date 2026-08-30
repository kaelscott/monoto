# ADR-001: Tauri em vez de Electron

Status: aceito · 2026-08-30

O app precisa rodar como programa de desktop, offline.

Electron embute um Chrome inteiro: instalador passa de 100 MB. Tauri usa o
navegador que já vem no sistema e gera poucos megabytes. O front-end é o
mesmo nos dois: React e JavaScript comum.

O lado Rust fica no mínimo — só registrar plugins, nenhuma lógica do app.
Para compilar é preciso ter Rust instalado além do Node.
