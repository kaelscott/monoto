# ADR-008: Salvar manual em vez de auto-save

Status: aceito · 2026-08-30 · substitui o auto-save do protótipo

O protótipo salvava sozinho 500 ms depois da última tecla (debounce).

O debounce precisa de um timer guardado entre renders, cancelado a cada
tecla e limpo quando a nota troca — e se o usuário muda de nota antes dos
500 ms, é preciso pensar em qual nota o timer vai gravar. Pouco código,
bastante coisa para segurar na cabeça.

Salvar com Ctrl+S é uma função chamada por um clique: sem timer, sem estado
escondido. O usuário passa a saber quando a nota foi salva.

Em troca, fechar o app com alteração pendente perde a alteração — a tela
precisa deixar claro quando há mudança não salva.
