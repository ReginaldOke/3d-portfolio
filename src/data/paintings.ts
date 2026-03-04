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

// Gallery layout:
// - Room is 24 wide x 20 deep x 6 high
// - Central partition column at x=0, runs from z=-3 to z=3
// - Paintings on left wall, right wall, and both sides of central column
// - Window on back-left wall area
// - Wine bar near front-right

export const paintings: PaintingData[] = [
  // LEFT WALL paintings
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
    position: [-11.9, 2.4, -3],
    rotation: [0, Math.PI / 2, 0],
    scale: [3.2, 1.8],
  },
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
    position: [-11.9, 2.4, 4],
    rotation: [0, Math.PI / 2, 0],
    scale: [3.2, 1.8],
  },

  // CENTRAL COLUMN — left side (facing left, towards left wall)
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
    position: [-0.26, 2.4, 0],
    rotation: [0, -Math.PI / 2, 0],
    scale: [3.0, 1.7],
  },

  // CENTRAL COLUMN — right side (facing right, towards right wall)
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
    position: [0.26, 2.4, 0],
    rotation: [0, Math.PI / 2, 0],
    scale: [3.0, 1.7],
  },

  // RIGHT WALL painting
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
    position: [11.9, 2.4, 0],
    rotation: [0, -Math.PI / 2, 0],
    scale: [3.2, 1.8],
  },
]

export const cameraPath = {
  points: [
    // 0: Entrance — overview of the gallery from the front
    { pos: [0, 1.65, 8] as [number, number, number], lookAt: [0, 2.0, -2] as [number, number, number] },
    // 1: Left wall painting 1
    { pos: [-7, 1.65, -3] as [number, number, number], lookAt: [-11.9, 2.4, -3] as [number, number, number] },
    // 2: Left wall painting 2
    { pos: [-7, 1.65, 4] as [number, number, number], lookAt: [-11.9, 2.4, 4] as [number, number, number] },
    // 3: Central column — left face
    { pos: [-4, 1.65, 0] as [number, number, number], lookAt: [-0.26, 2.4, 0] as [number, number, number] },
    // 4: Central column — right face
    { pos: [4, 1.65, 0] as [number, number, number], lookAt: [0.26, 2.4, 0] as [number, number, number] },
    // 5: Right wall painting
    { pos: [7, 1.65, 0] as [number, number, number], lookAt: [11.9, 2.4, 0] as [number, number, number] },
    // 6: Wine bar + window view
    { pos: [2, 1.65, 6] as [number, number, number], lookAt: [-4, 2.0, 9.9] as [number, number, number] },
  ],
}
