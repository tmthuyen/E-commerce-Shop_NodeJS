# Print folder structure

```
function Print-Tree {
    param($Path = ".", $Indent = "")
    # Thêm $_.PSIsContainer để chỉ lấy thư mục, bỏ qua tệp tin
    Get-ChildItem -Path $Path | Where-Object { $_.PSIsContainer -and $_.Name -ne "node_modules" } | ForEach-Object {
        Write-Output "$Indent|-- $($_.Name)"
        Print-Tree -Path $_.FullName -Indent "$Indent|  "
    }
}
Print-Tree
```
