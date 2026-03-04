import { paintings } from '../data/paintings'
import Painting from './Painting'

export default function Paintings() {
  return (
    <group>
      {paintings.map((painting) => (
        <Painting key={painting.id} data={painting} />
      ))}
    </group>
  )
}
