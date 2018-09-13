class Upload < ApplicationRecord
  IMAGE_FORMATS = %w(ANI BMP CAL FAX GIF IMG JBG JPE JPEG JPG MAC PBM PCD PCX PCT PGM PNG PPM PSD RAS TGA TIFF WMF SVG)

  VIDEO_FORMATS = %w(AAF 3GP ASF AVCHD AVI BIK CAM COLLAB DAT DS DVR FLV M1V M2V FLA FLR SOL M4V WRAP MNG MOV MP4 MPEG-4 MKV MPEG THP MPEG MXF ROQ NSV Ogg RM SVI SMI SMK SWF WMV WTV YUV )

  TEXT_FORMATS = %w(0 1ST 600 602 ABW ACL AFP AMI ANS ASC AWW CCF CSV CWK DBK DITA DOC DOCM DOCX DOT DOTX EGT EPUB EZW FDX FTM FTX GDOC HTML HWP HWPML LOG LWP MBP MD ME MCW Mobi NB NBP NEIS ODM ODT OTT OMM PAGES PAP PDAX PDF QUOX Radix RTF RPT SDW SE STW Sxw TeX INFO Trof TXT UOF UOML VIA WPD WPS WPT WRD WRF WRI XHTML XML XPS)

  include AttachmentUploader::Attachment.new(:attachment)

  belongs_to :site,
    inverse_of: :uploads

  has_many :item_uploads, dependent: :destroy, foreign_key: :upload_path
  has_many :items, through: :item_uploads

  validates :site, presence: true

  def is_image
    IMAGE_FORMATS.include?(format.upcase)
  end
end
