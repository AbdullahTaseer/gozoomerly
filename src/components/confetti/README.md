# 🎉 Confetti Component

A reusable, customizable confetti explosion component built with React and canvas-confetti. Perfect for adding celebration effects to your birthday website and other applications!

## ✨ Features

- **Auto-fire on mount** - Automatically triggers confetti when component renders
- **Manual trigger button** - Optional button to manually fire confetti
- **Customizable options** - Full control over colors, shapes, physics, and timing
- **Multiple button positions** - Position the trigger button anywhere
- **TypeScript support** - Full type safety with interfaces
- **Responsive design** - Works on all screen sizes
- **Performance optimized** - Uses HTML5 Canvas for smooth animations

## 🚀 Installation

The component uses `canvas-confetti` which is already installed in your project.

## 📖 Usage

### Basic Import

```tsx
import { Confetti } from "@/components/confetti";
```

### Simple Auto-Fire

```tsx
<Confetti />
```

### With Custom Options

```tsx
<Confetti 
  autoFire={true}
  autoFireDelay={500}
  options={{
    particleCount: 100,
    colors: ['#FFD700', '#FF69B4', '#00CED1'],
    shapes: ['circle', 'star']
  }}
/>
```

### With Manual Button

```tsx
<Confetti 
  autoFire={false}
  showButton={true}
  buttonText="🎊 Celebrate!"
  buttonPosition="center"
/>
```

## 🔧 Props

### ConfettiProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFire` | `boolean` | `true` | Whether to automatically fire confetti on mount |
| `autoFireDelay` | `number` | `300` | Delay in milliseconds before auto-firing |
| `showButton` | `boolean` | `false` | Whether to show the manual trigger button |
| `buttonText` | `string` | `"🎉 Celebrate!"` | Text for the manual trigger button |
| `buttonPosition` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' \| 'center'` | `'top-right'` | Position of the manual trigger button |
| `buttonClassName` | `string` | `""` | Additional CSS classes for the button |
| `onConfettiComplete` | `() => void` | `undefined` | Callback function when confetti animation completes |
| `options` | `ConfettiOptions` | `{}` | Confetti animation options |
| `className` | `string` | `""` | Additional CSS classes for the canvas |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles for the canvas |

### ConfettiOptions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `particleCount` | `number` | `100` | Number of confetti particles |
| `spread` | `number` | `70` | Spread angle in degrees |
| `origin` | `{ x: number; y: number }` | `{ y: 0.6, x: 0.5 }` | Origin point (0-1 for x and y) |
| `colors` | `string[]` | `['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#32CD32', '#FF4500', '#1E90FF']` | Array of colors in HEX format |
| `shapes` | `('circle' \| 'square' \| 'star')[]` | `['circle', 'square']` | Array of particle shapes |
| `scalar` | `number` | `1.2` | Scaling factor for particle size |
| `startVelocity` | `number` | `45` | Initial velocity of particles |
| `decay` | `number` | `0.9` | Rate at which particles slow down |
| `gravity` | `number` | `1` | Gravity applied to particles |
| `drift` | `number` | `0` | Horizontal drift applied to particles |
| `ticks` | `number` | `200` | Number of frames particles last |
| `angle` | `number` | `90` | Launch angle in degrees |

## 🎨 Examples

### Birthday Celebration

```tsx
<Confetti 
  autoFire={true}
  autoFireDelay={1000}
  showButton={true}
  buttonText="🎂 Happy Birthday!"
  buttonPosition="center"
  options={{
    particleCount: 150,
    colors: ['#FF69B4', '#FFD700', '#00CED1', '#FF6347'],
    shapes: ['circle', 'star'],
    scalar: 1.5
  }}
/>
```

### Achievement Unlocked

```tsx
<Confetti 
  autoFire={false}
  showButton={true}
  buttonText="🏆 Achievement!"
  buttonPosition="top-left"
  options={{
    particleCount: 80,
    colors: ['#FFD700', '#FF69B4', '#00CED1'],
    shapes: ['star'],
    startVelocity: 60,
    spread: 90
  }}
/>
```

### Subtle Effect

```tsx
<Confetti 
  autoFire={true}
  autoFireDelay={2000}
  options={{
    particleCount: 30,
    spread: 45,
    startVelocity: 25,
    colors: ['#FFD700', '#FF69B4']
  }}
/>
```

## 🔄 Multiple Instances

You can use multiple Confetti components on the same page:

```tsx
<div className="relative">
  {/* Hero section confetti */}
  <Confetti autoFire={true} />
  
  {/* Button confetti */}
  <Confetti 
    autoFire={false} 
    showButton={true} 
    buttonPosition="bottom-right"
  />
</div>
```

## 🎯 Use Cases

- **Birthday celebrations** - Hero sections, success messages
- **Achievement notifications** - Game completions, milestones
- **Form submissions** - Successful form completions
- **Page transitions** - Welcome animations
- **Interactive elements** - Button clicks, hover effects
- **Special events** - Holidays, promotions, announcements

## 🚀 Performance Tips

- Use `autoFire={false}` when you don't need immediate animation
- Adjust `particleCount` based on performance needs
- Use `onConfettiComplete` callback for cleanup if needed
- Consider disabling on mobile devices with reduced motion preferences

## 🔧 Customization

The component automatically creates a multi-layered confetti effect:
1. **Main explosion** - Center burst with full options
2. **Side cannons** - Left and right bursts for dramatic effect
3. **Star burst** - Special star-shaped particles for celebration

All layers respect your custom options while maintaining the realistic physics and timing. 