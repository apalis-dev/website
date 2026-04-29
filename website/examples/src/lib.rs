use std::time::Duration;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Email {
    pub to: String,
    pub subject: String,
}

#[derive(Clone, Default)]
pub struct AppConfig {
    pub api_base_url: String,
    pub max_email_retries: u32,
    pub default_timeout: Duration,
}

#[derive(Debug, Default)]
pub struct EmailClient {
    //
}

#[derive(Debug, Default)]
pub struct MetricsCollector {
    //
}

#[derive(Debug, Clone, thiserror::Error)]
pub enum EmailError {
    #[error("Email couldnt be sent")]
    NotSent,
}

pub async fn send_email(email: Email) -> Result<(), EmailError> {
    // Implement your email sending logic here
    println!("Sending email to {:?}", email);

    Ok(())
}
