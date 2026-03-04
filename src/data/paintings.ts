export interface PaintingSlide {
  type: 'video' | 'image'
  src: string
  title: string
  description: string
}

export interface PaintingData {
  id: string
  slides: PaintingSlide[]
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number]
}

// Gallery layout (TurboSquid Art_Gallery_03):
// - Room is ~9.56 wide (x: -4.78 to 4.78) x ~19 deep (z: -9.6 to 9.6)
// - 6 square picture frames (1.44 x 1.44) — 3 on each side wall
// - Art surfaces at x = ±4.782, y = 1.754
// - Frames at z ≈ 5.17, 0.00, -5.17

export const paintings: PaintingData[] = [
  // LEFT WALL — front (z = 5.17), facing +X into room
  {
    id: 'canva-homepage',
    slides: [
      {
        type: 'video',
        src: '/videos/create-modal-redesign.mp4',
        title: 'Canva Homepage Redesign',
        description:
          "In 2024, I led the redesign of Canva's homepage, reimagining its information architecture, introducing improved patterns for discovering and creating designs, and evolving the UI to meet the needs of a modern, global audience.",
      },
      {
        type: 'video',
        src: '/videos/create-modal-redesign.mp4',
        title: 'Create Modal Redesign',
        description:
          'Redesigned the create modal with a focus on discoverability and user delight, enabling users to quickly find the right canvas for their creative vision.',
      },
    ],
    position: [-4.782, 1.754, 5.169],
    rotation: [0, Math.PI / 2, 0],
    scale: [1.7, 0.96],
  },

  // RIGHT WALL — front (z = 5.17), facing -X into room
  {
    id: 'project-2',
    slides: [
      {
        type: 'video',
        src: '/videos/create-modal-redesign.mp4',
        title: 'Design System',
        description:
          'Built a comprehensive design system from the ground up, establishing consistent patterns, tokens, and components across web and mobile platforms.',
      },
    ],
    position: [4.782, 1.754, 5.169],
    rotation: [0, -Math.PI / 2, 0],
    scale: [1.7, 0.96],
  },

  // LEFT WALL — middle (z = 0), facing +X into room
  {
    id: 'project-3',
    slides: [
      {
        type: 'video',
        src: '/videos/create-modal-redesign.mp4',
        title: 'Mobile Experience',
        description:
          'Crafted an intuitive mobile-first experience that adapts complex desktop workflows into elegant, touch-friendly interactions.',
      },
    ],
    position: [-4.782, 1.754, 0.002],
    rotation: [0, Math.PI / 2, 0],
    scale: [1.7, 0.96],
  },

  // RIGHT WALL — middle (z = 0), facing -X into room
  {
    id: 'project-4',
    slides: [
      {
        type: 'video',
        src: '/videos/create-modal-redesign.mp4',
        title: 'Dashboard Analytics',
        description:
          'Designed a data-rich analytics dashboard that transforms complex metrics into clear, actionable insights for business users.',
      },
    ],
    position: [4.782, 1.754, 0.002],
    rotation: [0, -Math.PI / 2, 0],
    scale: [1.7, 0.96],
  },

  // LEFT WALL — back (z = -5.17), facing +X into room
  {
    id: 'project-5',
    slides: [
      {
        type: 'video',
        src: '/videos/create-modal-redesign.mp4',
        title: 'Collaboration Tools',
        description:
          'Designed real-time collaboration features that enable teams to work together seamlessly, with presence indicators and contextual commenting.',
      },
    ],
    position: [-4.782, 1.754, -5.166],
    rotation: [0, Math.PI / 2, 0],
    scale: [1.7, 0.96],
  },

  // RIGHT WALL — back (z = -5.17), facing -X into room
  {
    id: 'project-6',
    slides: [
      {
        type: 'video',
        src: '/videos/create-modal-redesign.mp4',
        title: 'Brand Identity',
        description:
          'Led the evolution of a brand identity system, crafting a cohesive visual language that scales across products, marketing, and global touchpoints.',
      },
    ],
    position: [4.782, 1.754, -5.166],
    rotation: [0, -Math.PI / 2, 0],
    scale: [1.7, 0.96],
  },
]

export const cameraPath = {
  points: [
    // 0: Entrance — overview of the gallery from the front
    { pos: [0, 1.6, 7.5] as [number, number, number], lookAt: [0, 1.75, 0] as [number, number, number] },
    // 1: Left wall — front painting (close enough to fill viewport width)
    { pos: [-3.8, 1.6, 5.17] as [number, number, number], lookAt: [-4.78, 1.754, 5.169] as [number, number, number] },
    // 2: Right wall — front painting
    { pos: [3.8, 1.6, 5.17] as [number, number, number], lookAt: [4.78, 1.754, 5.169] as [number, number, number] },
    // 3: Left wall — middle painting
    { pos: [-3.8, 1.6, 0.0] as [number, number, number], lookAt: [-4.78, 1.754, 0.002] as [number, number, number] },
    // 4: Right wall — middle painting
    { pos: [3.8, 1.6, 0.0] as [number, number, number], lookAt: [4.78, 1.754, 0.002] as [number, number, number] },
    // 5: Left wall — back painting
    { pos: [-3.8, 1.6, -5.17] as [number, number, number], lookAt: [-4.78, 1.754, -5.166] as [number, number, number] },
    // 6: Right wall — back painting
    { pos: [3.8, 1.6, -5.17] as [number, number, number], lookAt: [4.78, 1.754, -5.166] as [number, number, number] },
  ],
}
