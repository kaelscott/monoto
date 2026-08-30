# ADR-011: Sem bandeja do sistema

Status: recusado · 2026-08-30

O protótipo punha um ícone na bandeja e fazia o X esconder o app em vez de
fechar.

É a única parte do projeto que exigia escrever Rust de verdade (`tray.rs`),
e o ADR-001 diz que o Rust fica no mínimo. Junto vinha um comportamento que
confunde: clicar no X e o app não fechar.

Um app de notas não precisa ficar rodando escondido. Sem bandeja, o atalho
global também perde o sentido (ADR-012).
