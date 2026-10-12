# Fonts

All bundled fonts are hosted locally as WOFF2 and loaded when used. System and
Georgia use installed fonts. General text-size controls scale Albanian and Arabic
text together; line spacing is adjustable. Preferences persist in localStorage.

## Arabic fonts

| Choice              | Source                                                                        | License or notice           |
| ------------------- | ----------------------------------------------------------------------------- | --------------------------- |
| Hamdullah (default) | [Diyanet](https://kuran.diyanet.gov.tr/Yayinlar)                              | DIYANET-NOTICE.txt          |
| Kitab Regular       | [Kitab](https://github.com/nuqayah/kitab-font)                                | KITAB-LICENSE.txt           |
| Amiri               | [Amiri](https://github.com/aliftype/amiri)                                    | FONT-LICENSE.txt            |
| Noto Naskh          | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/notonaskharabic) | NOTONASKHARABIC-LICENSE.txt |
| Abay (Emine)        | [Diyanet](https://kuran.diyanet.gov.tr/Yayinlar)                              | DIYANET-NOTICE.txt          |
| Lateef              | [SIL](https://software.sil.org/lateef/)                                       | LATEEF-LICENSE.txt          |
| System              | Installed Arabic fonts                                                        | Device-provided             |

Amiri also supplies the bilingual branding. Hamdullah's internal family name is
Shaikh Hamdullah Mushaf; the selectable label is Hamdullah. Lateef uses the
internal preference identifier latif for storage compatibility.

## Albanian fonts

The menu order is System, Roboto, Poppins, Open Sans, Lato, Montserrat, Georgia.
Bundled web fonts come from the official Google Fonts repository and retain
ROBOTO-LICENSE.txt, POPPINS-LICENSE.txt, OPENSANS-LICENSE.txt, LATO-LICENSE.txt,
and MONTSERRAT-LICENSE.txt. Regular/bold faces or variable weights support
Albanian characters, including accented letters.

## Licensing and typography

Keep font licenses and notices with redistributed files. Abay and Hamdullah
contain no explicit redistribution license in their source downloads; copyright
metadata reserves rights. Other bundled fonts retain their supplied open licenses.

Font metrics differ: Abay and Hamdullah have heavier strokes, while Lateef has
compact glyphs. Arabic shaping and diacritics depend on font support. Existing
private-use characters in the chapter source are not supported by every font;
do not substitute characters without a content correction request.
