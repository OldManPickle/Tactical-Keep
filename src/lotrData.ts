import { Task, QuadrantType } from './types';

// Helper to get formatted date relative to today's week Monday
export const getWeekDateString = (dayOffsetFromMonday: number): string => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + distanceToMonday + dayOffsetFromMonday);
  
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper for relative ISO date creation
export const getRelativeISODate = (daysAgo: number, hoursOffset = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursOffset);
  return d.toISOString();
};

export const getLOTRTasks = (): Task[] => {
  const rawData: {
    title: string;
    description: string;
    quadrant: QuadrantType;
    completed: boolean;
    color: string;
    tags?: string[];
    scheduledOffset?: number; // Offset from current week's Monday (0 = Mon, 1 = Tue...)
    completionAgoDays?: number; // Days ago completed
  }[] = [
    // --- Fellowship of the Ring (1 to 35) ---
    {
      title: "Bilbo's Farewell Speech",
      description: "Give a grand parting speech at the 111th birthday party and vanish using the Ring's power.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Shire", "Bilbo"],
      completionAgoDays: 6
    },
    {
      title: "The Ring's Secret Disclosure",
      description: "Listen to Gandalf's grave warning about the true nature of the Master Ring.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL RED",
      tags: ["Lore", "Gandalf"],
      completionAgoDays: 6
    },
    {
      title: "Depart Bag End Secretly",
      description: "Pack ancestral belongings and leave Bag End under cover of night, avoiding neighbors.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Shire", "Frodo"],
      completionAgoDays: 5
    },
    {
      title: "The Conspiracy Unmasked",
      description: "Confront Merry, Pippin, and Sam, who reveal they know about the Ring and insist on joining.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL GREEN",
      tags: ["Fellowship", "Loyalty"],
      completionAgoDays: 5
    },
    {
      title: "Shortcut to Mushrooms",
      description: "Evade the hunting Black Rider stalking the dirt lanes of Tookland.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Shire", "Stealth"],
      completionAgoDays: 5
    },
    {
      title: "Bucklebury Ferry Crossing",
      description: "Sprint to the ferry and cross the Brandywine River just ahead of the chasing Nazgûl.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL RED",
      tags: ["Escape", "River"],
      completionAgoDays: 4
    },
    {
      title: "Cook Bacon at Weathertop",
      description: "Fry juicy bacon slices and tomatoes on the hillside campfire. Don't let the smoke rise! (Sam's duty)",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL YELLOW",
      tags: ["Bacon", "Weathertop"],
      completionAgoDays: 4
    },
    {
      title: "Enter the Old Forest",
      description: "Avoid the sinister, path-switching trees of the ancient forest border.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL BLUE",
      tags: ["Journey", "Nature"],
      completionAgoDays: 4
    },
    {
      title: "Rescue from Old Man Willow",
      description: "Tom Bombadil sings a lively riddle song to free Pippin from the hungry willow trunk.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Wonders", "Bombadil"],
      completionAgoDays: 3
    },
    {
      title: "Vanquish the Barrow-wights",
      description: "Wake up inside the dark mound, strike the skeletal hands, and take ancient Westernesse daggers.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Combat", "Barrows"],
      completionAgoDays: 3
    },
    {
      title: "Prancing Pony Rendezvous",
      description: "Wait in the common room in Bree, accidentally trigger the Ring, and meet Strider.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Bree", "Strider"],
      completionAgoDays: 3
    },
    {
      title: "Butterbur's Forgotten Letter",
      description: "Retrieve Gandalf's long-delayed warning letter from the tavern innkeeper Barliman.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "DEFAULT",
      tags: ["Bree", "Mail"],
      completionAgoDays: 2
    },
    {
      title: "Cross Midgewater Marshes",
      description: "Trudge through muddy bogs, plagued by clouds of biting midges and neekerbreekers.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "DEFAULT",
      tags: ["Survival", "Bog"],
      completionAgoDays: 2
    },
    {
      title: "Stand Ground at Amon Sûl",
      description: "Defend the ruins of Weathertop from five Nazgûl with burning pitch torches and steel.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL RED",
      tags: ["Combat", "Nazgul"],
      completionAgoDays: 2
    },
    {
      title: "Flight to Bruinen Ford",
      description: "Arwen carries wounded Frodo on her swift horse, Asfaloth, outracing the Nazgûl horde.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL BLUE",
      tags: ["Escape", "Elves"],
      completionAgoDays: 1
    },
    {
      title: "Command the Bruinen Flood",
      description: "Recite the Elvish flood spell to summon rushing white horses in the river Bruce.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL BLUE",
      tags: ["Magic", "Rivendell"],
      completionAgoDays: 1
    },
    {
      title: "Heal the Morgul Wound",
      description: "Elrond applies Athelas and surgical lore to draw out the deadly Morgul metal splinter.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL GREEN",
      tags: ["Rivendell", "Frodo"],
      completionAgoDays: 1
    },
    {
      title: "Convene Elrond's Council",
      description: "Gather Elves, Dwarves, Men, and Hobbits to debate the final doom of Sauron's Ring.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL RED",
      tags: ["Council", "Eminent"],
      scheduledOffset: 0 // Monday
    },
    {
      title: "Reforge the Sword Narsil",
      description: "Gather the shattered shards of Elendil's legendary blade and forge them into Andúril.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL BLUE",
      tags: ["Anduril", "Smithcraft"],
      scheduledOffset: 1 // Tuesday
    },
    {
      title: "Accept the Weight of the Ring",
      description: "Stand before the silent assembly and declare: 'I will take the Ring, though I do not know the way.'",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Frodo", "Choice"],
      completionAgoDays: 1
    },
    {
      title: "Equip Bilbo's Heirloom Gifts",
      description: "Don the glistening lightweight Mithril mail shirt and tie the ancient elven blade Sting to the waist.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL YELLOW",
      tags: ["Gear", "Mithril"],
      completionAgoDays: 0
    },
    {
      title: "Breast the Redhorn Blizzard",
      description: "Struggle through deep, freezing snow on Caradhras as Saruman chants a storm spell.",
      quadrant: "urgent-important",
      completed: true,
      color: "DEFAULT",
      tags: ["Caradhras", "Mountain"],
      completionAgoDays: 0
    },
    {
      title: "De-riddle the West-gate of Moria",
      description: "Decipher the moon-letters on the elven door: 'Speak friend, and enter.'",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL GREEN",
      tags: ["Moria", "Riddle"],
      completionAgoDays: 0
    },
    {
      title: "Repel the Watcher in the Water",
      description: "Fight off the writhing, ancient lake tentacles seeking to drag the Fellowship under.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Combat", "Beast"],
      completionAgoDays: 0
    },
    {
      title: "Defend Mazarbul Chamber",
      description: "Barricade the stone doors of Balin's Tomb against orc swarms and a massive cave troll.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL RED",
      tags: ["Moria", "Combat"],
      completionAgoDays: 0
    },
    {
      title: "Confront Balrog at Khazad-dûm",
      description: "Stand upon the narrow stone arch and shatter the masonry to cast the Balrog into the abyss.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Gandalf", "Sacrifice"],
      completionAgoDays: 0
    },
    {
      title: "Caras Galadhon Sanctuary",
      description: "Seek refuge in the golden canopies of Lothlórien, guided by Haldir's archers.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Elves", "Lothlorien"],
      completionAgoDays: 0
    },
    {
      title: "Look into Galadriel's Mirror",
      description: "Pour silver water into the stone basin and gaze at visions of burning grey ships.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "PASTEL BLUE",
      tags: ["Lore", "Mirror"],
      completionAgoDays: 0
    },
    {
      title: "Receive Lothlórien Gifts",
      description: "Accept elven cloaks, leaf brooches, concentrated Lembas bread, and the Phial of Starglass.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Lothlorien", "Gear"],
      completionAgoDays: 0
    },
    {
      title: "Navigate the Great Anduin",
      description: "Paddle the light swan-boats through dangerous rushing rapids past the brown lands.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "DEFAULT",
      tags: ["River", "Travel"],
      completionAgoDays: 0
    },
    {
      title: "Pass the Pillars of Argonath",
      description: "Gaze in absolute awe at the titanic twin kings carved of grey mountain rock.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Anarion", "Isildur"],
      completionAgoDays: 0
    },
    {
      title: "Resist Boromir's Temptation",
      description: "Fend off Boromir's frantic, desperate attempt to snatch the Ring on the slopes of Amon Hen.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL YELLOW",
      tags: ["AmonHen", "Ring"],
      completionAgoDays: 0
    },
    {
      title: "Sunder the Nen Hithoel Ambush",
      description: "Engage the elite Uruk-hai forces hunting our camping site.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL RED",
      tags: ["Combat", "Uruk-hai"],
      completionAgoDays: 0
    },
    {
      title: "Honor Boromir's Last Stand",
      description: "Hold the dying warrior's hand, pledge to defend Minas Tirith, and send him over the falls.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Mourning", "Honor"],
      completionAgoDays: 0
    },
    {
      title: "Break the Fellowship",
      description: "Slip away in a lone boat with Sam towards Emyn Muil, letting the Hunters pursue the captives.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL GREEN",
      tags: ["Split", "Frodo"],
      completionAgoDays: 0
    },

    // --- The Two Towers (36 to 60) ---
    {
      title: "Track the Uruk-hai Captors",
      description: "Run three days and nights without rest across the rocky grassy terrain of Rohan.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL RED",
      tags: ["ThreeHunters", "Rohan"],
      scheduledOffset: 2 // Wednesday
    },
    {
      title: "Appease Marshal Éomer",
      description: "Verify your intentions with Rohan's rider patrol, earning Hasufel and Arod as mounts.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Rohan", "Horses"],
      completionAgoDays: 0
    },
    {
      title: "Explore Shadowy Fangorn",
      description: "Walk under the ancient lichen trees, tracking the escaped hobbits' small footprints.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "DEFAULT",
      tags: ["Fangorn", "Woods"],
      completionAgoDays: 0
    },
    {
      title: "Identify the White Rider",
      description: "Behold Gandalf returning from death, glowing in radiant white robes.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL BLUE",
      tags: ["Lore", "Gandalf"],
      completionAgoDays: 0
    },
    {
      title: "Rouse the Entmoot at Wellinghall",
      description: "Convince Treebeard and the slow-talking forest Ents to march against Saruman's iron works.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL TEAL",
      tags: ["Entmoot", "Allies"],
      scheduledOffset: 3 // Thursday
    },
    {
      title: "Exorcise King Théoden",
      description: "Expel Saruman's whispering parasite grip from the mind of Edoras' ruler.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Magic", "Gandalf"],
      completionAgoDays: 0
    },
    {
      title: "Banish Gríma Wormtongue",
      description: "Hurl the weeping, snitching traitor down the stone steps of Meduseld Golden Hall.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL YELLOW",
      tags: ["Edoras", "Banishment"],
      completionAgoDays: 0
    },
    {
      title: "Lead Refuge to Helm's Deep",
      description: "Escort the weak, older folk and children of Edoras safely to the Hornburg mountain fortress.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL BLUE",
      tags: ["Exodus", "Refugees"],
      scheduledOffset: 4 // Friday
    },
    {
      title: "Combat the Rohan Warg-Riders",
      description: "Counter-charge the savage warg scouting party along the narrow rocky path.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Combat", "Wargs"],
      completionAgoDays: 0
    },
    {
      title: "Greet the Elven Archers",
      description: "Welcome Commander Haldir and his Lothlórien archer cohort to the defense walls.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL BLUE",
      tags: ["Elves", "Allies"],
      completionAgoDays: 0
    },
    {
      title: "Defend the Hornburg Walls",
      description: "Hold the stone parapets against ten thousand iron-helmed Uruk-hai in the raging storm.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL RED",
      tags: ["Combat", "HelmsDeep"],
      completionAgoDays: 0
    },
    {
      title: "Seal the Deeping Wall Breach",
      description: "Brace the gap after Saruman's black powder explosive shatters the water culvert barrier.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL RED",
      tags: ["Combat", "Tactical"],
      completionAgoDays: 0
    },
    {
      title: "Ride Out in Final Glory",
      description: "Blow the Horn of Helm Hammerhand and charge directly into the dawn spearhead.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL YELLOW",
      tags: ["Charge", "Theoden"],
      completionAgoDays: 0
    },
    {
      title: "Unleash the Huorn Forest",
      description: "Drive the routing Uruk-hai forces into the dark, moving forest of angry trees.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL GREEN",
      tags: ["Victory", "Forest"],
      completionAgoDays: 0
    },
    {
      title: "Sunder the Isengard Dam",
      description: "Pry open the wooden floodgates of the River Isen, drowning the fires of industry.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Ents", "Isengard"],
      completionAgoDays: 0
    },
    {
      title: "Raid Saruman's Pantry",
      description: "Discover hidden stores of cured pork, wine, and barrels of choice Old Toby pipe-weed.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Feast", "MerryPippin"],
      completionAgoDays: 0
    },
    {
      title: "Tame the Creature Sméagol",
      description: "Subdue Gollum using the painful golden Elven rope, extracting a pledge of safe passage.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Gollum", "Pledge"],
      completionAgoDays: 0
    },
    {
      title: "Trudge through Dead Marshes",
      description: "Carefully place footsteps in the glowing swamp mud, staying clear of dead faces in the candle-lights.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Mire", "Stealth"],
      completionAgoDays: 0
    },
    {
      title: "Scout the Morannon Gate",
      description: "Observe Sauron's military forces marching through the massive black iron gate.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "DEFAULT",
      tags: ["Spying", "Mordor"],
      completionAgoDays: 0
    },
    {
      title: "Capture by Ithilien Rangers",
      description: "Submit to Faramir's rangers and answer his questions at Henneth Annûn waterfall haven.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL GREEN",
      tags: ["Gondor", "Rangers"],
      completionAgoDays: 0
    },
    {
      title: "Save Gollum at Forbidden Pool",
      description: "Intercede on Gollum's behalf to spare his neck from Gondor's expert bowmen.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL BLUE",
      tags: ["Mercy", "Gollum"],
      completionAgoDays: 0
    },
    {
      title: "Osgiliath Citadel Evacuation",
      description: "Carry Frodo clear of the falling rubble during the sudden attack of the Black Riders.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Combat", "Ruins"],
      completionAgoDays: 0
    },
    {
      title: "Flee the Ruined Gondor Front",
      description: "Slip westwards past Ithilien to begin the arduous trek up the Morgul stairs.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "DEFAULT",
      tags: ["Journey", "Escape"],
      completionAgoDays: 0
    },
    {
      title: "Cook Stewed Rabbit with Herbs",
      description: "Boil two wild conies with Sam's gathered meadow-herbs in Ithilien (No chips!).",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL YELLOW",
      tags: ["Cooking", "Rabbit"],
      completionAgoDays: 0
    },
    {
      title: "Climb the Stairs of Cirith Ungol",
      description: "Trudge up the straight, steep rock stairs of the mountain cliff behind Aragorn's tracking mark.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Mount", "Stealth"],
      completionAgoDays: 0
    },

    // --- Return of the King (61 to 90) ---
    {
      title: "Wrestle the Seeing Stone Away",
      description: "Pry the dangerous, glowing Palantír of Orthanc out of Pippin's burning, sleeping fingers.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Palantir", "Danger"],
      completionAgoDays: 0
    },
    {
      title: "Light the Beacons of Gondor",
      description: "Climb the peaks of Amon Dîn and fire the resin-soaked wood to cry for Rohan's aid.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Beacons", "Signals"],
      completionAgoDays: 0
    },
    {
      title: "Marshal the Rohirrim Army",
      description: "Assemble six thousand swords and shields at Dunharrow encampment for speed.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL RED",
      tags: ["Army", "Rohan"],
      scheduledOffset: 5 // Saturday
    },
    {
      title: "Enter the Paths of the Dead",
      description: "Walk beneath the dark Firien Wood and stand before the yawning bone-studded door.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Hunters", "Ghost"],
      completionAgoDays: 0
    },
    {
      title: "Pledge the Oathbreaker King",
      description: "Demand the phantoms honor their broken vow to Isildur to gain absolute freedom.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Ghost", "Oath"],
      completionAgoDays: 0
    },
    {
      title: "Struggle over River Osgiliath",
      description: "Hold the wooden ferry crossings against Orc legions pouring on black rafts.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL BLUE",
      tags: ["Bridge", "Defense"],
      completionAgoDays: 0
    },
    {
      title: "Defend Pelennor Citadel",
      description: "Guard the outer gates of Minas Tirith against stone throwing siege engines.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL RED",
      tags: ["Combat", "Gondor"],
      scheduledOffset: 6 // Sunday
    },
    {
      title: "Break the Giant Ram Grond",
      description: "Stand the heavy iron city gates against the demonic wolf-headed war machine.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL RED",
      tags: ["Defense", "Citadel"],
      scheduledOffset: 6 // Sunday
    },
    {
      title: "Encounter Key Nazgûl Master",
      description: "Hold the stone plaza when the Witch-king descends on his massive lizard beast.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL PURPLE",
      tags: ["Combat", "WitchKing"],
      scheduledOffset: 0
    },
    {
      title: "Interrupt Denethor's Pyre",
      description: "Curb the madness of Gondor's Steward to save wounded Faramir from the temple flame.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Rescue", "Faramir"],
      completionAgoDays: 0
    },
    {
      title: "Hark the Rohirrim Horns",
      description: "Form the vanguard line at the edge of Pelennor Fields as Rohan enters the war.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL YELLOW",
      tags: ["Charge", "Rohan"],
      completionAgoDays: 0
    },
    {
      title: "Slay the Witch-king of Angmar",
      description: "Raise Eowyn's shield, declare 'I am no man,' and plunge the dagger into his crown.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Combat", "Prophecy"],
      completionAgoDays: 0
    },
    {
      title: "Seize the Black Corsair Fleet",
      description: "Mow down Umbar's pirates using the unstoppable emerald wave of Oathbreaker ghosts.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Sea", "Ships"],
      completionAgoDays: 0
    },
    {
      title: "Attend Gondor Houses of Healing",
      description: "Apply wild Kingsfoil leaves to heal Eowyn, Faramir and Pippin of the Black Breath.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL GREEN",
      tags: ["Healing", "Medicine"],
      scheduledOffset: 1
    },
    {
      title: "Convene Middle-Earth Last Stand",
      description: "Propose a diversionary assault at the Black Gate to buy Frodo precious volcanic minutes.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL BLUE",
      tags: ["Council", "War"],
      scheduledOffset: 2
    },
    {
      title: "Watch Minas Morgul March",
      description: "Crouch in the valley shadows as the glowing city gate emits thousands of marching iron troops.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "DEFAULT",
      tags: ["Spying", "Shadow"],
      completionAgoDays: 0
    },
    {
      title: "Breeze through Shelob's Caves",
      description: "Follow Gollum into the pitch dark cavern, holding the golden light vial high.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "PASTEL YELLOW",
      tags: ["Underworld", "Stealth"],
      completionAgoDays: 0
    },
    {
      title: "Vanquish Great Spider Shelob",
      description: "Plunge Sting deep into the spider belly, driving the ancestral monster into the dark cracks.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Combat", "Sting"],
      completionAgoDays: 0
    },
    {
      title: "Infiltrate Cirith Ungol Tower",
      description: "Slip past the gargoyle watchmen to locate Frodo locked in the highest stone turret.",
      quadrant: "urgent-important",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Rescue", "Frodo"],
      completionAgoDays: 0
    },
    {
      title: "Ascend Volcanic Gorgoroth",
      description: "Carry Frodo's exhausted frame over the jagged, blistering hot lava rock slopes.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL RED",
      tags: ["FrodoSam", "Volcano"],
      scheduledOffset: 3
    },
    {
      title: "Engage Gollum at the Abyss",
      description: "Grapple with Gollum at the edge of the roaring furnace as he bites the Ring free.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL ORANGE",
      tags: ["Clash", "Gollum"],
      scheduledOffset: 4
    },
    {
      title: "Destroy the Sovereign Ring",
      description: "Watch the golden One Ring slide into the bubbling red volcanic fire of Mount Doom.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL RED",
      tags: ["Mordor", "Victory"],
      scheduledOffset: 4
    },
    {
      title: "Command the Eagle Rescue Team",
      description: "Ride Gwaihir into the crumbling volcanic clouds to fly the Hobbits out of the ash.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL BLUE",
      tags: ["Eagles", "Rescue"],
      scheduledOffset: 5
    },
    {
      title: "Crown King Aragorn Elessar",
      description: "Place the Silver Crown of Isildur onto Aragorn's head at Minas Tirith court.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL PINK",
      tags: ["Gondor", "King"],
      scheduledOffset: 5
    },
    {
      title: "Return to the Shire Boundary",
      description: "Ride the four ponies back home to find the Shire taken over by Saruman's ruffians.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL GREEN",
      tags: ["Shire", "Homeward"],
      scheduledOffset: 6
    },
    {
      title: "Scour the Ruffian Rufflers",
      description: "Raise the Shire-horn and lead hobbit archers to capture the invading ruffian gangs.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL RED",
      tags: ["War", "Shire"],
      scheduledOffset: 6
    },
    {
      title: "Confront Sharkey at Bag End",
      description: "Corner Saruman on your very doorstep, forcing his final complete defeat.",
      quadrant: "urgent-important",
      completed: false,
      color: "PASTEL TEAL",
      tags: ["Shire", "Saruman"],
      scheduledOffset: 0
    },
    {
      title: "Sail from the Grey Havens",
      description: "Board the grand Elven ship with Frodo, Bilbo, and Elrond to head towards Valinor.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL BLUE",
      tags: ["Farewell", "Havens"],
      scheduledOffset: 1
    },
    {
      title: "Complete Red Book of Westmarch",
      description: "Hand down the manuscript containing the Red Book to Samwise to write the last pages.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL PINK",
      tags: ["History", "Samwise"],
      scheduledOffset: 2
    },
    {
      title: "Return to Sam's Hearth",
      description: "Walk back into Bag End, lift up Eleanor, sit down, and declare 'Well, I'm back.'",
      quadrant: "important-not-urgent",
      completed: false,
      color: "PASTEL YELLOW",
      tags: ["Shire", "Samwise"],
      scheduledOffset: 3
    },

    // --- Auxiliary Lore Quests (91 to 100) to complete exactly 100 ---
    {
      title: "Elrond's High Library Search",
      description: "Sift through dusty elven manuscripts to discover ancient lore on the three Silmarils.",
      quadrant: "urgent-not-important",
      completed: false,
      color: "PASTEL BLUE",
      tags: ["Rivendell", "Research"],
      scheduledOffset: 2
    },
    {
      title: "Galadriel's Crystal Phial Polish",
      description: "Carefully inspect and polish the crystal containing the starlight of Eärendil.",
      quadrant: "urgent-not-important",
      completed: false,
      color: "PASTEL TEAL",
      tags: ["Lothlorien", "Gear"],
      scheduledOffset: 3
    },
    {
      title: "Beg a Lock of Galadriel's Hair",
      description: "Gimli requests a single strand of Galadriel's hair, receiving three golden hairs in return.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Gimli", "Galadriel"],
      completionAgoDays: 2
    },
    {
      title: "Legolas HelmsDeep Score Count",
      description: "Cross-reference kills during HelmsDeep battle. Beat Legolas's record count of 42.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL PURPLE",
      tags: ["Gimli", "Legolas"],
      completionAgoDays: 3
    },
    {
      title: "Ent-wash Bathing Session",
      description: "Bathe in the flowing water of River Entwash inside Fangorn, adding inches to height.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL GREEN",
      tags: ["Water", "Ents"],
      completionAgoDays: 4
    },
    {
      title: "Squeal Gollum's Dark Riddles",
      description: "Solve dark, slippery riddles under the misty mountains in the goblin caverns.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Riddles", "Hobbit"],
      completionAgoDays: 5
    },
    {
      title: "Tom Bombadil's Song Recitative",
      description: "Memorize: 'Ring-a-dong-dillo! Tom Bombadillo!' to summon aid in barrow emergencies.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "DEFAULT",
      tags: ["Song", "Bombadil"],
      completionAgoDays: 5
    },
    {
      title: "Saddle up Bill the Pony",
      description: "Equip loyal Bill the Pony with water-skins, cooking pots, and hobbit blankets.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL PINK",
      tags: ["Breeds", "Equip"],
      completionAgoDays: 6
    },
    {
      title: "Construct Lórien Tree-Flets",
      description: "Tie secure rope ladders and timber flooring high in the caranhon mallorn-trees.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "PASTEL TEAL",
      tags: ["Elves", "Carpentry"],
      completionAgoDays: 6
    },
    {
      title: "Harvest Maggot's Mushrooms",
      description: "Raid Farmer Maggot's gardens for fresh, fat brown mushrooms before dogs bark.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "PASTEL ORANGE",
      tags: ["Shire", "Foraging"],
      completionAgoDays: 6
    }
  ];

  // We map the raw templates into valid, fully formed Task objects.
  return rawData.map((item, index) => {
    const id = `lotr-${index + 1}`;
    const priority = 100 - index; // Chronological priority ordering
    const createdAt = item.completionAgoDays !== undefined
      ? getRelativeISODate(item.completionAgoDays, index % 24)
      : getRelativeISODate(0, index % 24);

    let completedAt: string | undefined;
    if (item.completed) {
      const daysAgo = item.completionAgoDays !== undefined ? item.completionAgoDays : 0;
      // Subtract hours to differentiate completions dynamically
      completedAt = getRelativeISODate(daysAgo, (index * 3) % 12);
    }

    let scheduledDate: string | undefined;
    if (item.scheduledOffset !== undefined) {
      scheduledDate = getWeekDateString(item.scheduledOffset);
    }

    const pastelToRGBMap: Record<string, string> = {
      'PASTEL RED': 'RED',
      'PASTEL ORANGE': 'RED',
      'PASTEL YELLOW': 'RED',
      'PASTEL GREEN': 'GREEN',
      'PASTEL TEAL': 'BLUE',
      'PASTEL BLUE': 'BLUE',
      'PASTEL PURPLE': 'BLUE',
      'PASTEL PINK': 'RED',
      'DEFAULT': 'DEFAULT'
    };
    const mappedColor = pastelToRGBMap[item.color.toUpperCase()] || 'DEFAULT';

    return {
      id,
      title: item.title,
      description: item.description,
      quadrant: item.quadrant,
      completed: item.completed,
      color: mappedColor,
      priority,
      createdAt,
      completedAt,
      scheduledDate,
      tags: item.tags || []
    };
  });
};
