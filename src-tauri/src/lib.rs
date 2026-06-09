// Ponto de entrada do lado Rust do app.
// Mantemos o Rust no mínimo: aqui só "ligamos" os plugins e a bandeja.

// a bandeja (system tray) fica isolada no arquivo tray.rs
mod tray;

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
        // plugins de atalho global e de autostart (Fase 2d).
        // A lógica (qual atalho, ligar/desligar) fica no JavaScript.
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        // cria o ícone da bandeja quando o app inicia (Fase 2c)
        .setup(|app| {
            tray::criar_bandeja(app)?;
            Ok(())
        })
        // ao tentar fechar a janela (X), escondemos em vez de encerrar o app.
        // Para sair de verdade, use "Sair" no menu da bandeja.
        .on_window_event(|janela, evento| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = evento {
                api.prevent_close();
                let _ = janela.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
