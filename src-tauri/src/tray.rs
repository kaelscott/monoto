// tray.rs
// Cria o ícone na bandeja do sistema (system tray), com um menu simples.
// Mantemos só o essencial e isolado neste arquivo:
//   - clique esquerdo no ícone -> mostra a janela
//   - item "Abrir" -> mostra a janela
//   - item "Sair"  -> fecha o app de verdade
// (Fechar a janela no "X" NÃO encerra o app: ele se esconde na bandeja.
//  Essa parte do "esconder" fica no lib.rs.)

use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::Manager;

// Monta a bandeja. Chamada uma vez, quando o app inicia (no setup do lib.rs).
pub fn criar_bandeja(app: &tauri::App) -> tauri::Result<()> {
    // 1) cria os itens do menu (id interno, texto visível, habilitado, atalho)
    let abrir = MenuItem::with_id(app, "abrir", "Abrir", true, None::<&str>)?;
    let sair = MenuItem::with_id(app, "sair", "Sair", true, None::<&str>)?;

    // 2) junta os itens num menu
    let menu = Menu::with_items(app, &[&abrir, &sair])?;

    // 3) cria o ícone na bandeja, usando o mesmo ícone da janela
    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        // não abre o menu com o clique esquerdo (o esquerdo serve para abrir a janela)
        .show_menu_on_left_click(false)
        // quando clica num item do menu
        .on_menu_event(|app, evento| match evento.id.as_ref() {
            "abrir" => mostrar_janela(app),
            "sair" => app.exit(0),
            _ => {}
        })
        // quando clica no próprio ícone da bandeja (só o botão esquerdo)
        .on_tray_icon_event(|tray, evento| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = evento
            {
                mostrar_janela(tray.app_handle());
            }
        })
        .build(app)?;

    Ok(())
}

// Mostra e foca a janela principal (a janela "main").
fn mostrar_janela(app: &tauri::AppHandle) {
    if let Some(janela) = app.get_webview_window("main") {
        let _ = janela.show();
        let _ = janela.set_focus();
    }
}
