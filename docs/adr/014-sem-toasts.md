# ADR-014: Sem toasts

Status: recusado · 2026-08-30

O protótipo tinha avisos que apareciam no canto e sumiam sozinhos.

Metade confirmava o que já era visível — a nota nova aparece na lista, não
precisa de aviso dizendo isso. Sobra o caso de erro, que é importante demais
para sumir sozinho depois de três segundos.

Erro do banco vira uma mensagem fixa na tela, feita onde o erro acontece.
Ação bem-sucedida não gera aviso: o resultado na tela é o aviso.
