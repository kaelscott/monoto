/*
  regrasHorario.teste.js
  Teste da escolherTag(). Roda com "node src/regrasHorario.teste.js".

  Não usa biblioteca de teste: é só um "assert" do próprio Node, que
  reclama quando o resultado sai diferente do esperado.
*/
import assert from "node:assert";
import { escolherTag } from "./regrasHorario.js";

// uma regra de exemplo: dias úteis, das 09:00 às 12:00, tag "trabalho"
const trabalho = {
  tag: "trabalho",
  dias: ["seg", "ter", "qua", "qui", "sex"],
  inicio: "09:00",
  fim: "12:00",
  ativa: true,
};

// 2026-08-31 é uma segunda-feira
const segundaAs10 = new Date(2026, 7, 31, 10, 0);
const segundaAs15 = new Date(2026, 7, 31, 15, 0);
const domingoAs10 = new Date(2026, 7, 30, 10, 0);

// dentro do dia e do horário: vale a regra
assert.equal(escolherTag([trabalho], segundaAs10), "trabalho");

// dia certo, hora fora da faixa: não vale
assert.equal(escolherTag([trabalho], segundaAs15), "");

// hora certa, dia fora da lista: não vale
assert.equal(escolherTag([trabalho], domingoAs10), "");

// regra desligada não vale, mesmo com dia e hora certos
const trabalhoDesligado = {
  tag: "trabalho",
  dias: ["seg", "ter", "qua", "qui", "sex"],
  inicio: "09:00",
  fim: "12:00",
  ativa: false,
};
assert.equal(escolherTag([trabalhoDesligado], segundaAs10), "");

// sem regra nenhuma: nota nasce sem tag
assert.equal(escolherTag([], segundaAs10), "");

// as pontas da faixa contam (09:00 e 12:00 valem)
assert.equal(escolherTag([trabalho], new Date(2026, 7, 31, 9, 0)), "trabalho");
assert.equal(escolherTag([trabalho], new Date(2026, 7, 31, 12, 0)), "trabalho");

console.log("escolherTag: todos os testes passaram");
