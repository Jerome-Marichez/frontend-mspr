import { 
  trigger, 
  transition, 
  style, 
  query, 
  animate,
  group
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  // Transition de la page d'accueil vers les autres pages (vers la droite)
  transition('home => *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%'
      })
    ], { optional: true }),
    
    query(':enter', [
      style({
        transform: 'translateX(100%)',
        opacity: 0.8
      })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('450ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'translateX(-15%)',
          opacity: 0.8
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'translateX(0%)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ]),
  
  // Transition d'une page vers la page d'accueil (vers la gauche)
  transition('* => home', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%'
      })
    ], { optional: true }),
    
    query(':enter', [
      style({
        transform: 'translateX(-100%)',
        opacity: 0.8
      })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('450ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'translateX(15%)',
          opacity: 0.8
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'translateX(0%)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ]),
  
  // Transition entre les pages autres que l'accueil
  transition('* => *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%'
      })
    ], { optional: true }),
    
    query(':enter', [
      style({
        transform: 'translateX(100%)',
        opacity: 0.8
      })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('450ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'translateX(-100%)',
          opacity: 0.8
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'translateX(0%)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ])
]);
