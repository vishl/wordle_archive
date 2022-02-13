
import structuredClone from '@ungap/structured-clone';
import { useLocalStorage } from './hooks/useLocalStorage'

export const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'hsl(231, 16%, 92%)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    height: 'calc(100% - 2rem)',
    width: 'calc(100% - 2rem)',
    backgroundColor: 'hsl(231, 16%, 92%)',
    boxShadow: '0.2em 0.2em calc(0.2em * 2) #A3A7BD, calc(0.2em * -1) calc(0.2em * -1) calc(0.2em * 2) #FFFFFF',
    border: 'none',
    borderRadius: '1rem',
    maxWidth: '475px',
    maxHeight: '650px',
    position: 'relative',
  },
}

var _modalStylesDark = structuredClone(modalStyles);
  _modalStylesDark.overlay.backgroundColor = 'hsl(231, 16%, 25%)'
  _modalStylesDark.content.backgroundColor = 'hsl(231, 16%, 25%)'
  _modalStylesDark.content.boxShadow = '0.2em 0.2em calc(0.2em * 2) #252834, calc(0.2em * -1) calc(0.2em * -1) calc(0.2em * 2) #43475C'

export const modalStylesDark = _modalStylesDark
