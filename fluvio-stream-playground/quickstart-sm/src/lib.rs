use fluvio_smartmodule::{smartmodule, Result, SmartModuleRecord};

#[smartmodule(filter)]
pub fn filter(record: &SmartModuleRecord) -> Result<bool> {
    let string = std::str::from_utf8(record.value.as_ref())?;
    Ok(string.contains("a"))
}



