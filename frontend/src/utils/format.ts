/**
 * Utilitários de formatação reutilizáveis.
 * Centraliza lógica de formatação que antes estava duplicada em múltiplas páginas.
 */

/** Formata um valor numérico como moeda brasileira (R$). */
export const formatBRL = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
