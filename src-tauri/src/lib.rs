// Ponto de entrada do lado Rust do app.
// Mantemos o Rust no mínimo: aqui só "ligamos" os plugins que o front usa.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // plugin que abre links/arquivos no programa padrão do sistema (vem do template)
        .plugin(tauri_plugin_opener::init())
        // plugin de banco de dados SQLite (Fase 2a).
        // Tudo (criar tabelas, ler, gravar) é feito pelo JavaScript;
        // aqui apenas registramos o plugin para o front poder usá-lo.
        .plugin(tauri_plugin_sql::Builder::new().build())
        // plugin de armazenamento de configurações (Fase 2b).
        // Guarda settings.json; também é todo controlado pelo JavaScript.
        .plugin(tauri_plugin_store::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
