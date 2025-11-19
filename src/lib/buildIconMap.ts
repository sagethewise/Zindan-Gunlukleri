// src/lib/buildIconMap.ts

// Her build slug'ı için, o build'de göstermek istediğin ikon dosya adları.
// Dosya adlarının başına class klasörünü otomatik ekleyeceğiz.
export const BUILD_ICON_FILES: Record<string, string[]> = {
  // Barbarian - Whirlwind Leveling
  "whirlwind": [
    "ground_stomp.png",
    "war_cry.png",
    "rallying_cry.png",
    "wrath_of_the_berserker.png",
  ],

  // Druid - Rake Tornado
  "companion": [
    "wolves.png",
    "ravens.png",
    "poison_creeper.png",
    "cataclysm.png",
    "wind_shear.png",
    "pulverize.png"
  ],

  // Druid - Pulverize Earthquake
  "pulverize": [
    "debilitating_roar.png",
    "cyclone_armor.png",
    "grizzly_rage.png",
    "claw.png",
    "pulverize.png",
  ],

  // Sorcerer - Firewall Hydra
  "firewall-hydra": [
    "teleport.png",
    "hydra.png",
    "ice_armor.png",
    "familiar.png",
    "fire_bolt.png",
    "firewall.png",
  ],

    // Necromancer - Minion
  "minion": [
    "decrepify.png",
    "corpse_explosion.png",
    "corpse_explosion.png",
    "golem.png",
    "raise_skeleton.png",
    "blight.png",
  ],
  
      // Rogue - Dance of Knight
  "dance-of-knight": [
    "shadow_clone.png",
    "poison_imbuement.png",
    "dark_shroud.png",
    "concealment.png",
    "shadow_imbuement.png",
    "dance_of_knives.png",
  ],

        // Spiritborn - Evade
  "evade": [
    "thunderspike.png",
    "armored_hide.png",
    "toxic_skin.png",
    "the_hunter.png",
    "quill_volley.png",
    "ravager.png",
  ],
};
