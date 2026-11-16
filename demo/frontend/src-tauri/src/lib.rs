use tauri_plugin_shell::ShellExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // In release desktop bundle, launch the Python FastAPI sidecar
            #[cfg(not(debug_assertions))]
            {
                match app.shell().sidecar("robo-backend") {
                    Ok(cmd) => match cmd.spawn() {
                        Ok((_rx, _child)) => {
                            println!("Python sidecar backend started successfully");
                        }
                        Err(e) => {
                            eprintln!("Failed to spawn Python sidecar: {}", e);
                        }
                    },
                    Err(e) => {
                        eprintln!("Failed to configure sidecar: {}", e);
                    }
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
