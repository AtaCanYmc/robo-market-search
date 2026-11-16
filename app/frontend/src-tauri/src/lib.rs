use tauri_plugin_shell::ShellExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Launch the Python FastAPI sidecar
            // In Tauri v2, sidecar identifier can be 'binaries/robo-backend' or 'robo-backend'
            let sidecar_result = app
                .shell()
                .sidecar("binaries/robo-backend")
                .or_else(|_| app.shell().sidecar("robo-backend"));

            match sidecar_result {
                Ok(cmd) => match cmd.spawn() {
                    Ok((mut rx, _child)) => {
                        println!("Python sidecar backend started successfully");
                        tauri::async_runtime::spawn(async move {
                            while let Some(event) = rx.recv().await {
                                match event {
                                    tauri_plugin_shell::process::CommandEvent::Stdout(line) => {
                                        println!("[backend] {}", String::from_utf8_lossy(&line));
                                    }
                                    tauri_plugin_shell::process::CommandEvent::Stderr(line) => {
                                        eprintln!("[backend err] {}", String::from_utf8_lossy(&line));
                                    }
                                    _ => {}
                                }
                            }
                        });
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
