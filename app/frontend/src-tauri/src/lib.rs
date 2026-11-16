use tauri_plugin_shell::ShellExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Launch the Python FastAPI sidecar
            match app.shell().sidecar("robo-backend") {
                Ok(cmd) => match cmd.spawn() {
                    Ok((_rx, _child)) => {
                        println!("Python sidecar backend started successfully");
                    }
                    Err(e) => {
                        eprintln!(
                            "Info: Sidecar spawn skipped (run backend separately in dev or build sidecar): {}",
                            e
                        );
                    }
                },
                Err(e) => {
                    eprintln!("Info: Sidecar configuration note: {}", e);
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
