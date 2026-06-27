/**
 * Demo seed data for PetMood.
 *
 * Seeds one representative item per screen into localStorage for the demo
 * cat "__luna". Each key is written only once — existing user data is never
 * overwritten. Safe to call on every app boot.
 */

const DEMO_ID = '__luna'

function lsSeedOnce(key, value) {
  if (localStorage.getItem(key) !== null) return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function seedMockData() {
  const id = DEMO_ID
  const now = new Date()
  const NOW = now.toISOString()
  const TODAY = NOW.slice(0, 10)
  const TODAY_KEY = now.toDateString()

  // ── Reads (History, Dashboard, MoodInsights, WeeklyInsights, BehaviorLab) ──
  lsSeedOnce(`petmood_reads_${id}`, [
    {
      id: 'read_demo_1',
      activity: 'Loafing on the windowsill',
      feeling: 'Relaxed and content',
      confidence: 'high',
      evidence: [
        'Loaf posture – weight fully settled',
        'Soft purr audible throughout clip',
        'Slow blink at 0:04',
      ],
      keyframeCount: 3,
      tags: ['calm'],
      note: 'Sunny afternoon — looks very comfortable',
      createdAt: NOW,
    },
  ])

  // ── Care Log ──────────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_care_${id}`, {
    [TODAY_KEY]: {
      goals: { water: 50, meals: 1, play: 15, maxWater: 100, maxMeals: 3, maxPlay: 60 },
      log: [
        { id: 'care_demo_1', type: 'Meal', detail: 'Wet food — morning portion', time: NOW },
      ],
      savedAt: NOW,
    },
  })

  // ── Pet Passport ──────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_passport_${id}`, {
    name: 'Luna',
    breed: 'Domestic Shorthair',
    dob: '2021-03-15',
    weight: '4.2',
    colour: 'Tabby',
    gender: 'Female',
    neutered: true,
    microchipId: '900123456789012',
    insurancePolicy: '',
    insuranceProvider: '',
    vaccinations: [
      { name: 'Rabies', status: 'Up to date', due: '2027-03-15' },
      { name: 'FVRCP', status: 'Up to date', due: '2027-03-15' },
      { name: 'FeLV', status: '', due: '' },
    ],
    notes: 'Indoor only. Very food-motivated. Prefers chin scratches.',
  })

  // ── Health Log ────────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_health_${id}`, [
    {
      type: 'observation',
      title: 'Sneezed three times after room cleaning',
      severity: 'Mild',
      notes: 'Resolved on its own within an hour. Monitoring.',
      vetVisit: false,
      date: TODAY,
      id: 'health_demo_1',
      createdAt: NOW,
    },
  ])

  // ── Pharmacy Log ──────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_pharmacy_${id}`, [
    {
      name: 'Revolution Plus',
      dose: '1 tube (2.5–5 kg)',
      frequency: 'Monthly',
      purpose: 'Flea, tick & heartworm prevention',
      startDate: TODAY,
      endDate: '',
      refillDate: '',
      id: 'med_demo_1',
      paused: false,
      lastGiven: NOW,
    },
  ])

  // ── Emergency Vault ───────────────────────────────────────────────────────
  lsSeedOnce(`petmood_emergency_${id}`, {
    vetName: 'Dr. Sarah Tan',
    vetPhone: '+65 6234 5678',
    vetAddress: '123 Pet Clinic Road, Singapore 123456',
    emergencyVetName: 'Animal Emergency Hospital',
    emergencyVetPhone: '+65 6789 0123',
    emergencyVetAddress: '456 Emergency Ave, Singapore 234567',
    ownerName: 'Alex',
    ownerPhone: '+65 9123 4567',
    ownerAltPhone: '',
    sitterName: '',
    sitterPhone: '',
    allergies: 'None known',
    medications: 'Revolution Plus (applied monthly)',
    conditions: 'None',
    bloodType: '',
    microchipId: '900123456789012',
    feedingSchedule: '7 am and 6 pm — 80 g wet food per meal',
    feedingNotes: 'Add a teaspoon of water to wet food',
    specialInstructions: 'Prefers quiet. Hides under bed when nervous.',
    insuranceProvider: '',
    policyNumber: '',
    insurancePhone: '',
    catName: 'Luna',
  })

  // ── Litter Log ────────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_litter_${id}`, [
    { id: 'litter_demo_1', type: 'urinate', note: 'Normal', time: NOW },
  ])

  // ── Nutrition Lab ─────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_nutrition_${id}`, {
    meals: [
      {
        foodType: 'Wet food',
        brand: 'Royal Canin',
        portion: '80g',
        note: 'Ate all',
        id: 'meal_demo_1',
        time: NOW,
      },
    ],
    profile: {
      weight: '4.2',
      targetWeight: '4.0',
      dailyCalories: '240',
      waterGoal: '200',
      diet: 'Wet food primary',
      allergies: '',
      brand: 'Royal Canin',
    },
    waterLog: { [TODAY_KEY]: 75 },
  })

  // ── Training Log ──────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_training_${id}`, {
    sessions: [
      {
        cue: 'Sit',
        technique: 'Clicker training',
        duration: '5',
        success: 'Good progress',
        notes: '3 out of 5 on cue — improving',
        date: TODAY,
        id: 'train_demo_1',
      },
    ],
    cues: ['Sit', 'Come', 'Stay', 'High five', 'Touch target'],
  })

  // ── Bond Log ──────────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_bond_${id}`, [
    {
      id: 'bond_demo_1',
      type: 'bond',
      moment: 'Lap sitting',
      notes: 'Fell asleep on lap for about 20 minutes',
      time: NOW,
    },
  ])

  // ── Personality Compass ───────────────────────────────────────────────────
  lsSeedOnce(`petmood_personality_${id}`, {
    values: {
      social: 6,
      energy: 5,
      curious: 8,
      affection: 7,
      vocal: 4,
      playful: 7,
      brave: 5,
      adaptable: 6,
    },
    notes: 'Very curious and food-motivated. Warms up to strangers within 30 min.',
  })

  // ── Leash Guide — first step completed ───────────────────────────────────
  lsSeedOnce(`petmood_leash_${id}`, {
    completed: { s1_1: true },
    notes: 'Started harness introduction this week. Sniffed it without retreating.',
  })

  // ── Play Lab ──────────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_play_${id}`, [
    {
      id: 'play_demo_1',
      toy: 'Wand toy',
      duration: '10',
      energy: 'High energy',
      engagement: 'Very engaged',
      notes: 'Caught the feather 3 times — great session',
      time: NOW,
    },
  ])

  // ── Outdoor Confidence ────────────────────────────────────────────────────
  lsSeedOnce(`petmood_outdoor_${id}`, {
    sessions: [
      { id: 'outdoor_demo_1', level: 2, notes: 'Explored the balcony with harness on', date: TODAY },
    ],
    milestones: [
      { id: 'first_step',   label: 'First step outside',   unlocked: true,  unlockedAt: NOW  },
      { id: 'five_min',     label: '5 minutes outside',    unlocked: false, unlockedAt: null },
      { id: 'sniff_ground', label: 'Sniffed the ground',   unlocked: false, unlockedAt: null },
      { id: 'grass',        label: 'Walked on grass',      unlocked: false, unlockedAt: null },
      { id: 'solo_explore', label: 'Solo exploration',     unlocked: false, unlockedAt: null },
      { id: 'new_smell',    label: 'New smell curiosity',  unlocked: false, unlockedAt: null },
      { id: 'met_person',   label: 'Met a new person',     unlocked: false, unlockedAt: null },
      { id: 'no_leash',     label: 'Off-leash confidence', unlocked: false, unlockedAt: null },
    ],
  })

  // ── Environment Audit — common items checked ──────────────────────────────
  lsSeedOnce(`petmood_environment_${id}`, {
    toxic_plants:       true,
    secure_windows:     true,
    balcony_safe:       false,
    string_hazards:     true,
    chemicals_locked:   true,
    medications_secured: true,
    food_stored:        true,
    litter_private:     true,
    water_fresh:        true,
    hiding_spots:       true,
    vertical_space:     false,
    scratching_post:    true,
  })

  // ── Cleaning Log ──────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_cleaning_${id}`, {
    log: {
      litter_scoop: NOW,
      food_bowl:    NOW,
      water_bowl:   NOW,
    },
    custom: [],
  })

  // ── Sitter Mode ───────────────────────────────────────────────────────────
  lsSeedOnce(`petmood_sitter_${id}`, {
    greeting: "Hi! I'm Luna. I'm shy at first but warm up quickly.",
    feedingTime: '7 am and 6 pm',
    feedingAmount: '80 g wet food each meal',
    feedingBrand: 'Royal Canin',
    waterTip: 'Please refill my water bowl once a day.',
    playTip: 'I love wand toys! 10–15 minutes twice a day is ideal.',
    litterLocation: 'Bathroom, next to the door',
    litterFrequency: 'Scoop once a day',
    hidingSpots: 'Under the bed or inside the wardrobe',
    fearNotes: 'Loud noises and unfamiliar people',
    medNotes: 'Revolution Plus — applied on the 1st of each month',
    specialInstructions: 'Keep bedroom doors closed at night.',
    vetPhone: '+65 6234 5678',
    ownerPhone: '+65 9123 4567',
  })

  // ── Human Injury Log ──────────────────────────────────────────────────────
  lsSeedOnce(`petmood_human_injury_${id}`, [
    {
      id: 'injury_demo_1',
      type: 'scratch',
      severity: 'Minor',
      context: 'During play',
      notes: 'Play-related, not aggression — got too excited',
      date: TODAY,
      bodyPart: 'Hand',
    },
  ])

  // ── Photo Gallery ─────────────────────────────────────────────────────────
  const galleryPlaceholder =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fdf3e8"/><stop offset="100%" stop-color="#eef5ed"/></linearGradient></defs><rect fill="url(#g)" width="400" height="400" rx="24"/><circle cx="200" cy="170" r="48" fill="#e89a3c" opacity="0.25"/><text x="200" y="260" text-anchor="middle" fill="#524436" font-family="Plus Jakarta Sans,sans-serif" font-size="22" font-weight="600">Luna</text><text x="200" y="290" text-anchor="middle" fill="#857464" font-family="Plus Jakarta Sans,sans-serif" font-size="14">Sunny windowsill</text></svg>',
    )
  lsSeedOnce(`petmood_gallery_${id}`, [
    {
      id: 'photo_demo_1',
      dataUrl: galleryPlaceholder,
      caption: 'Sunny windowsill nap',
      tag: 'Cozy',
      date: NOW,
    },
  ])

  // ── AI Companion — one seeded exchange ────────────────────────────────────
  lsSeedOnce(`petmood_ai_chat_${id}`, [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm Stitch, Luna's AI companion. Ask me anything about her mood, behaviour, or care.",
    },
    {
      id: 'u_demo_1',
      role: 'user',
      content: 'Why does Luna knead her blanket?',
    },
    {
      id: 'a_demo_1',
      role: 'assistant',
      content:
        "Kneading is a comforting holdover from kittenhood — Luna did it to stimulate milk from her mother. When she kneads a blanket now, it means she feels safe and content. It often happens just before she settles in for a nap. No action needed; just enjoy the purring.",
    },
  ])
}
