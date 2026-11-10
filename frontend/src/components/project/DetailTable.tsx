import type { ProjectDetailTable } from '../../data/projectDetails'

export function DetailTable({ table, titleId }: { table: ProjectDetailTable; titleId: string }) {
  return (
    <div className="project-detail-table-scroll" role="region" aria-labelledby={titleId} tabIndex={0}>
      <table className={`project-detail-table${table.columns.length === 2 ? ' project-detail-table--two-column' : ''}`} aria-labelledby={titleId}>
        <thead>
          <tr>{table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) => {
                if (cell === null) return null
                const text = typeof cell === 'string' ? cell : cell.text
                const rowSpan = typeof cell === 'string' ? undefined : cell.rowSpan
                const content = typeof cell !== 'string' && cell.groups
                  ? cell.groups.map((group) => <div key={group.title} className="project-detail-table-group"><strong>{group.title}</strong><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)
                  : text
                return index === 0
                  ? <th key={index} scope="row" rowSpan={rowSpan}>{content}</th>
                  : <td key={index} rowSpan={rowSpan}>{content}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

