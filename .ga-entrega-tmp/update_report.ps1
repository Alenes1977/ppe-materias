$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$mdPath = Join-Path $root 'gestion-aplicada-contraste-fuentes.md'
$md = [IO.File]::ReadAllText($mdPath, [Text.Encoding]::UTF8)
$section = @'
## Contraste adicional de la matriz de competencias

Se revisó la pestaña «Competencias» del archivo «Resultados de aprendizaje_GESTIÓN APLICADA_Plan 21_para Guías Docentes_20260417». La matriz relaciona competencias con columnas de asignaturas y aporta una comprobación complementaria de los resultados de aprendizaje por curso. En seis de los ocho bloques que se pueden comparar, la unión de resultados marcados en la hoja coincide con los resultados de la materia del JSON: Contabilidad y Finanzas, Derecho, Comunicación en Idiomas Modernos, Prácticas académicas externas, Trabajo Fin de Grado y Formación Transversal.

| Materia o aspecto | Diferencia observada |
| --- | --- |
| Empresa y Entorno | El JSON incluye RA12 y RA13 para la materia, pero la matriz no los marca en las columnas de Gestión Empresarial 1–7. La hoja sí asigna RA12 a Derecho 2, Prácticas externas y CORE, y RA13 a Comunicación Empresarial 3–6 y Prácticas externas. |
| Código CE8 | La fila 25 de la hoja se identifica como «CE8 RA28», aunque la descripción corresponde a RA27 («Gestionar eficazmente los documentos asociados a los sistemas de gestión y procesos de la organización conforme a los principios de la calidad total»). La descripción sí coincide con el resultado RA27 del JSON; la matriz lo marca en Gestión Empresarial 1, 3 y 4. |
| Comunicación en las Organizaciones | El JSON incluye RA16 en esta materia; la hoja marca RA16 en las columnas genéricas de Inglés, Francés y Alemán, no en Comunicación Empresarial 1–6. La hoja, además, marca RA20 en Comunicación Empresarial 3–6, que no figura entre los resultados de esta materia en el JSON. |
| Formación Complementaria | El JSON identifica «Intercambio Académico», pero la hoja no contiene una columna propia para esta asignatura; no se puede contrastar su asignación de resultados. |

La matriz no contiene créditos ni semestres y representa los idiomas mediante columnas genéricas. No permite validar la secuenciación del plan ni resolver la discrepancia de créditos que aparece en las cabeceras web de los módulos I y II. Estos hallazgos se registran como diferencias entre la matriz del Plan 21 y la información del JSON; se mantiene como criterio canónico el Verifica vigente y no se modifican los datos del JSON por esta sola comparación.

'@
if (-not $md.Contains('## Ponderaciones de evaluación')) { throw 'Punto de inserción Markdown ausente.' }
if (-not $md.Contains('## Contraste adicional de la matriz de competencias')) {
    $md = $md.Replace('## Ponderaciones de evaluación', $section + '## Ponderaciones de evaluación')
}
$sourceLine = '- [Matriz de resultados de aprendizaje para guías docentes (Google Sheets), pestaña Competencias](https://docs.google.com/spreadsheets/d/13n82JWOVkWu1yXI_yYIpcW-CaMI7NSuAr1qqExhTDQo/edit?gid=1634743879#gid=1634743879), título del archivo fechado 17 de abril de 2026; consultada el 25 de septiembre de 2026. Copia XLSX incluida en el paquete.'
if (-not $md.Contains('Matriz de resultados de aprendizaje para guías docentes')) {
    $md = $md.Replace('- [Plan de estudios del Grado en Gestión Aplicada', $sourceLine + [Environment]::NewLine + '- [Plan de estudios del Grado en Gestión Aplicada')
}
[IO.File]::WriteAllText($mdPath, $md, [Text.UTF8Encoding]::new($false))

$docxPath = Join-Path $root 'gestion-aplicada-contraste-fuentes.docx'
$tmpRoot = Join-Path $root '.ga-entrega-tmp'
$extractRoot = Join-Path $tmpRoot ('docx-edit-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $extractRoot -Force | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::ExtractToDirectory($docxPath, $extractRoot)
$xmlPath = Join-Path $extractRoot 'word\document.xml'
$xml = [Xml.XmlDocument]::new()
$xml.PreserveWhitespace = $true
$xml.Load($xmlPath)
$w = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$r = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
$n = [Xml.XmlNamespaceManager]::new($xml.NameTable)
$n.AddNamespace('w', $w)
$body = $xml.SelectSingleNode('//w:body', $n)
function E([string]$s) { [System.Security.SecurityElement]::Escape($s) }
function P([string]$text,[bool]$heading) {
    $safe = E $text
    if ($heading) {
        return '<w:p><w:pPr><w:pStyle w:val="Heading1"/><w:keepNext/><w:spacing w:before="260" w:after="100"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:color w:val="000000"/><w:sz w:val="28"/></w:rPr><w:t xml:space="preserve">' + $safe + '</w:t></w:r></w:p>'
    }
    return '<w:p><w:pPr><w:spacing w:after="100" w:line="260" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">' + $safe + '</w:t></w:r></w:p>'
}
function C([string]$text,[int]$width,[bool]$header,[bool]$shade) {
    $safe = E $text
    $fill = ''
    if ($header) { $fill = '<w:shd w:val="clear" w:fill="1F4E78"/>' }
    elseif ($shade) { $fill = '<w:shd w:val="clear" w:fill="F2F6FA"/>' }
    $rpr = '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="18"/>'
    if ($header) { $rpr += '<w:b/><w:color w:val="FFFFFF"/>' }
    $rpr += '</w:rPr>'
    return '<w:tc><w:tcPr><w:tcW w:w="' + $width + '" w:type="dxa"/>' + $fill + '<w:tcMar><w:top w:w="110" w:type="dxa"/><w:start w:w="110" w:type="dxa"/><w:bottom w:w="110" w:type="dxa"/><w:end w:w="110" w:type="dxa"/></w:tcMar></w:tcPr><w:p><w:pPr><w:spacing w:after="40" w:line="235" w:lineRule="auto"/></w:pPr><w:r>' + $rpr + '<w:t xml:space="preserve">' + $safe + '</w:t></w:r></w:p></w:tc>'
}
function TR([string]$a,[string]$b,[string]$c,[bool]$header,[bool]$shade) {
    $head = ''
    if ($header) { $head = '<w:trPr><w:tblHeader/></w:trPr>' }
    return '<w:tr>' + $head + (C $a 1850 $header $shade) + (C $b 4550 $header $shade) + (C $c 2960 $header $shade) + '</w:tr>'
}
$ref = $null
foreach ($p in $body.SelectNodes('./w:p', $n)) {
    $txt = ($p.SelectNodes('.//w:t', $n) | ForEach-Object { $_.InnerText }) -join ''
    if ($txt -eq 'ESTADO DE LA INFORMACIÓN DE EVALUACIÓN') { $ref = $p; break }
}
if (-not $ref) { throw 'No se encontró la sección de evaluación.' }
if (-not $body.InnerXml.Contains('Contraste adicional de la matriz de competencias')) {
    $table = '<w:tbl><w:tblPr><w:tblW w:w="9360" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/><w:left w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/><w:right w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/></w:tblBorders><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid><w:gridCol w:w="1850"/><w:gridCol w:w="4550"/><w:gridCol w:w="2960"/></w:tblGrid>'
    $table += TR 'Materia o aspecto' 'Diferencia observada' 'Alcance' $true $false
    $table += TR 'Empresa y Entorno' 'El JSON incluye RA12 y RA13 en esta materia, pero la matriz no los marca en las columnas Gestión Empresarial 1–7. La hoja marca RA12 en Derecho 2, Prácticas externas y CORE, y RA13 en Comunicación Empresarial 3–6 y Prácticas externas.' 'Validar con los responsables la asignación por curso antes de cambiar el JSON.' $false $false
    $table += TR 'Código CE8' 'La fila 25 de la hoja dice CE8 RA28, pero su descripción corresponde a RA27. La descripción concuerda con el JSON y está marcada en Gestión Empresarial 1, 3 y 4.' 'Corregir o confirmar el código en la matriz. RA28 sigue siendo el resultado de Contabilidad y Finanzas.' $false $true
    $table += TR 'Comunicación en las Organizaciones' 'La matriz marca RA16 en las columnas genéricas de idiomas, no en Comunicación Empresarial 1–6. También marca RA20 en Comunicación Empresarial 3–6, resultado que no figura para esta materia en el JSON.' 'Confirmar si son diferencias deliberadas del mapa Plan 21 o errores de asignación.' $false $false
    $table += TR 'Formación Complementaria' 'El JSON identifica Intercambio Académico; la matriz no tiene una columna propia para esta asignatura.' 'No se puede contrastar su asignación de resultados con esta hoja.' $false $true
    $table += '</w:tbl>'
    $content = (P 'Contraste adicional de la matriz de competencias' $true)
    $content += P 'Se revisó la pestaña «Competencias» del archivo «Resultados de aprendizaje_GESTIÓN APLICADA_Plan 21_para Guías Docentes_20260417». La matriz relaciona competencias con columnas de asignaturas y aporta una comprobación complementaria de los resultados de aprendizaje por curso. En seis de los ocho bloques que se pueden comparar, la unión de resultados marcados en la hoja coincide con los resultados de la materia del JSON: Contabilidad y Finanzas, Derecho, Comunicación en Idiomas Modernos, Prácticas académicas externas, Trabajo Fin de Grado y Formación Transversal.' $false
    $content += $table
    $content += P 'La matriz no contiene créditos ni semestres y representa los idiomas mediante columnas genéricas. No permite validar la secuenciación del plan ni resolver la discrepancia de créditos que aparece en las cabeceras web de los módulos I y II. Estos hallazgos se registran como diferencias entre la matriz del Plan 21 y la información del JSON; se mantiene como criterio canónico el Verifica vigente y no se modifican los datos del JSON por esta sola comparación.' $false
    $fragment = $xml.CreateDocumentFragment()
    $fragment.InnerXml = '<wrapper xmlns:w="' + $w + '">' + $content + '</wrapper>'
    $wrapper = $fragment.FirstChild
    while ($wrapper.FirstChild) {
        $node = $wrapper.FirstChild
        [void]$wrapper.RemoveChild($node)
        [void]$body.InsertBefore($node, $ref)
    }
}
$relsPath = Join-Path $extractRoot 'word\_rels\document.xml.rels'
$rels = [Xml.XmlDocument]::new()
$rels.PreserveWhitespace = $true
$rels.Load($relsPath)
$relNs = 'http://schemas.openxmlformats.org/package/2006/relationships'
$ids = @($rels.DocumentElement.ChildNodes | ForEach-Object { $_.GetAttribute('Id') } | Where-Object { $_ -match '^rId\d+$' } | ForEach-Object { [int]($_ -replace '^rId','') })
$linkId = 'rId' + ((($ids | Measure-Object -Maximum).Maximum) + 1)
$hasSource = $false
foreach ($p in $body.SelectNodes('./w:p', $n)) {
    $txt = ($p.SelectNodes('.//w:t', $n) | ForEach-Object { $_.InnerText }) -join ''
    if ($txt -like '*Matriz de resultados de aprendizaje para guías docentes*') { $hasSource = $true }
}
if (-not $hasSource) {
    $dateP = $null
    foreach ($p in $body.SelectNodes('./w:p', $n)) {
        $txt = ($p.SelectNodes('.//w:t', $n) | ForEach-Object { $_.InnerText }) -join ''
        if ($txt.StartsWith('Fecha de consulta de la web')) { $dateP = $p; break }
    }
    if (-not $dateP) { throw 'No se encontró el cierre de fuentes.' }
    $frag = $xml.CreateDocumentFragment()
    $frag.InnerXml = '<wrapper xmlns:w="' + $w + '" xmlns:r="' + $r + '"><w:p><w:pPr><w:pStyle w:val="ListBullet"/><w:spacing w:after="60"/></w:pPr><w:r><w:t xml:space="preserve">Matriz de resultados de aprendizaje para guías docentes, pestaña Competencias, archivo Plan 21 fechado 17 de abril de 2026; consultada el 25 de septiembre de 2026. </w:t></w:r><w:hyperlink r:id="' + $linkId + '"><w:r><w:rPr><w:color w:val="0563C1"/><w:u w:val="single"/></w:rPr><w:t>abrir Google Sheets</w:t></w:r></w:hyperlink></w:p></wrapper>'
    $sourceP = $frag.FirstChild.FirstChild
    [void]$body.InsertBefore($sourceP, $dateP)
    $rel = $rels.CreateElement('Relationship', $relNs)
    $rel.SetAttribute('Id', $linkId)
    $rel.SetAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink')
    $rel.SetAttribute('Target', 'https://docs.google.com/spreadsheets/d/13n82JWOVkWu1yXI_yYIpcW-CaMI7NSuAr1qqExhTDQo/edit?gid=1634743879#gid=1634743879')
    $rel.SetAttribute('TargetMode', 'External')
    [void]$rels.DocumentElement.AppendChild($rel)
}
$settings = [Xml.XmlWriterSettings]::new()
$settings.Encoding = [Text.UTF8Encoding]::new($false)
$settings.Indent = $false
$writer = [Xml.XmlWriter]::Create($xmlPath, $settings)
$xml.Save($writer)
$writer.Dispose()
$relsWriter = [Xml.XmlWriter]::Create($relsPath, $settings)
$rels.Save($relsWriter)
$relsWriter.Dispose()
$updated = Join-Path $tmpRoot 'gestion-aplicada-contraste-fuentes-actualizado.docx'
if (Test-Path $updated) { Remove-Item -LiteralPath $updated }
[IO.Compression.ZipFile]::CreateFromDirectory($extractRoot, $updated, [IO.Compression.CompressionLevel]::Optimal, $false)
Copy-Item -LiteralPath $updated -Destination $docxPath -Force
Get-Item $mdPath, $docxPath | Select-Object Name,Length
