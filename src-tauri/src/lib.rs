use log::{info, Level, LevelFilter, SetLoggerError};

use static_init::dynamic;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use tauri::{Manager, Window};

use pt_down_core::*;

#[tauri::command]
async fn process(token: String, instance: String) {
    let bot = Instance::new(&token, &instance);

    match bot.run().await {
        Ok(()) => {}
        Err(e) => {
            dbg!("Error here");
            log::error!("{e}");
        }
    }
}

#[tauri::command]
fn echo(val: String) {
    dbg!(val);
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct LogPayload {
    message: String,
    level: String,
}

#[dynamic]
static mut WINDOW_OP: Option<Window> = None;

struct Logger;

static LOGGER: Logger = Logger;

impl Logger {
    fn init() -> Result<(), SetLoggerError> {
        log::set_logger(&LOGGER).map(|()| log::set_max_level(LevelFilter::Trace))
    }
}

impl log::Log for Logger {
    fn enabled(&self, _metadata: &log::Metadata) -> bool {
        true
    }

    fn log(&self, record: &log::Record) {
        if let Some(window) = WINDOW_OP.read().as_ref() {
            if let Some(module) = record.module_path() {
                // if module != "jni::wrapper::jnienv" {
                //     dbg!(record.level());
                // }

                if record.level() == Level::Error {
                    dbg!(module);
                }

                if module != "pt_down_core" && module != "pt-down" {
                    return;
                }
                let payload = LogPayload {
                    message: record.args().to_string(),
                    level: format!("{}", record.level()),
                };
                window.emit("log", payload).unwrap();
            }
        } else {
        }
    }

    fn flush(&self) {}
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = Logger::init();

    info!("Starting the app");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![process, echo])
        .setup(|app| {
            info!("Setting up the app");
            let window = app.get_window("main").unwrap();
            *WINDOW_OP.write() = Some(window);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
