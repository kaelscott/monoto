# ADR-012: Sem atalho global

Status: recusado · 2026-08-30

O protótipo registrava Ctrl+Shift+N no sistema todo para mostrar e esconder
a janela.

Depende da bandeja para fazer sentido, e ela saiu (ADR-011) — sem janela
escondida, não há o que trazer de volta. Além disso, atalho global é
registrado no sistema inteiro: se outro programa já usa a combinação, um dos
dois para de funcionar, e o erro é silencioso.

Alt+Tab já resolve. Atalhos internos (Ctrl+N, Ctrl+S) continuam.
