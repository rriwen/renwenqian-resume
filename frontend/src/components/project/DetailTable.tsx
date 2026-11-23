import type { ProjectDetailTable } from '../../data/projectDetails'
import { ProjectGallery } from './ProjectGallery'

export function DetailTable({ table, titleId }: { table: ProjectDetailTable; titleId: string }) {
  const illustrated = table.rows.some(row => row.illustration)
  return (
    <div className="project-detail-table-scroll" role="region" aria-labelledby={titleId} tabIndex={0}>
      <table className={`project-detail-table${illustrated ? ' project-detail-table--illustrated' : table.columns.length === 2 ? ' project-detail-table--two-column' : ''}`} aria-labelledby={titleId}>
        <thead>
          <tr>{(table.mergeDescriptions ? table.columns.slice(0, 1) : table.columns).map((column) => <th key={column} scope="col">{column}</th>)}{illustrated && <th scope="col">示意图</th>}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) => {
                if (cell === null || (table.mergeDescriptions && index === 1)) return null
                if (table.mergeDescriptions && index === 0) {
                  const description = row.cells[1]
                  return <th key={index} scope="row"><span>{row.decision && <span className={`project-detail-table-decision is-${row.decision}`} role="img" aria-label={row.decision === 'selected' ? '采用' : '不采用'}>{row.decision === 'selected' ? '✓' : '✕'}</span>}{typeof cell === 'string' ? cell : cell.text}</span><p className="project-detail-table-description">{typeof description === 'string' ? description : description?.text}</p></th>
                }
                const text = typeof cell === 'string' ? cell : cell.text
                const rowSpan = typeof cell === 'string' ? undefined : cell.rowSpan
                const content = typeof cell !== 'string' && cell.groups
                  ? cell.groups.map((group) => <div key={group.title} className="project-detail-table-group"><strong>{group.title}</strong><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)
                  : text
                return index === 0
                  ? <th key={index} scope="row" rowSpan={rowSpan}>{content}</th>
                  : <td key={index} rowSpan={rowSpan}>{content}</td>
              })}
              {illustrated && <td>{row.illustration && <ProjectGallery items={[row.illustration]} layout="stacked" />}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

