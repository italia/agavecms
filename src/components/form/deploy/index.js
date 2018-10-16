import LocalServerSettings from './LocalServerSettings'
import SecureFtpWithPasswordSettings from './SecureFtpWithPasswordSettings'
import SecureFtpWithIdentityFileSettings from './SecureFtpWithIdentityFileSettings'
import FtpSettings from './FtpSettings'

export default {
  local_server: LocalServerSettings,
  secure_ftp_with_password: SecureFtpWithPasswordSettings,
  secure_ftp_with_identity_file: SecureFtpWithIdentityFileSettings,
  ftp: FtpSettings,
}
