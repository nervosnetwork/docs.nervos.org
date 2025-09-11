import { ccc, Bytes, bytesFrom, BytesLike, mol, NumLike } from "@ckb-ccc/shell";

// As an more advance example, we’ve developed a role-playing game consisting of 4 schema files:
//
// - Basic Types
// - Attributes
// - Roles
// - Skills
//
// ref: https://docs.nervos.org/docs/serialization/example-role-playing-game

/* ```common/basic_types.mol
/ AttrValue is an alias of `byte`.
/
/ Since Molecule data are strongly-typed, it can gives compile time guarantees
/ that the right type of value is supplied to a method.
/
/ In this example, we use this alias to define an unsigned integer which
/ has an upper limit: 100.
/ So it's easy to distinguish between this type and a real `byte`.
/ Of course, the serialization wouldn't do any checks for this upper limit
/ automatically. You have to implement it by yourself.
/
/ **NOTE**:
/ - This feature is dependent on the exact implementation.
/   In official Rust generated code, we use new type to implement this feature.
 
array AttrValue [byte; 1];
```*/

export type AttrValue = number;
export type AttrValueLike = NumLike;
export const AttrValueCodec: mol.Codec<AttrValueLike, AttrValue> =
  mol.Codec.from({
    byteLength: 1,
    encode: attrValueToBytes,
    decode: attrValueFromBytes,
  });

export function attrValueFrom(val: AttrValueLike): AttrValue {
  if (typeof val === "number") {
    if (val > 100) {
      throw new Error(`Invalid attr value ${val}`);
    }
    return val;
  }

  if (typeof val === "bigint") {
    if (val > BigInt(100)) {
      throw new Error(`Invalid attr value ${val}`);
    }
    return Number(val);
  }

  if (typeof val === "string") {
    const num = parseInt(val);
    if (num > 100) {
      throw new Error(`Invalid attr value ${val}`);
    }
    return num;
  }

  throw new Error(`Invalid attr value ${val}`);
}

export function attrValueToBytes(val: AttrValueLike): Bytes {
  return bytesFrom([attrValueFrom(val)]);
}

export function attrValueFromBytes(bytes: BytesLike): AttrValue {
  return attrValueFrom(bytesFrom(bytes)[0]);
}

/*
/ SkillLevel is an alias of `byte`, too.
/
/ Each skill has only 10 levels, so we use another alias of `byte` to distinguish.

array SkillLevel [byte; 1];
*/
export type SkillLevel = number;
export type SkillLevelLike = NumLike;
export const SkillLevelCodec: mol.Codec<SkillLevelLike, SkillLevel> =
  mol.Codec.from({
    byteLength: 1,
    encode: skillLevelToBytes,
    decode: skillLevelFromBytes,
  });

export function skillLevelFrom(val: SkillLevelLike): SkillLevel {
  if (typeof val === "number") {
    if (val > 10) {
      throw new Error(`Invalid skill level ${val}`);
    }
    return val;
  }

  if (typeof val === "bigint") {
    if (val > BigInt(10)) {
      throw new Error(`Invalid skill level ${val}`);
    }
    return Number(val);
  }

  if (typeof val === "string") {
    const num = parseInt(val);
    if (num > 10) {
      throw new Error(`Invalid skill level ${val}`);
    }
    return num;
  }

  throw new Error(`Invalid skill level ${val}`);
}

export function skillLevelToBytes(val: SkillLevelLike): Bytes {
  return bytesFrom([skillLevelFrom(val)]);
}

export function skillLevelFromBytes(bytes: BytesLike): SkillLevel {
  return skillLevelFrom(bytesFrom(bytes)[0]);
}

// Define several unsigned integers.
// array Uint8 [byte; 1];
// array Uint16 [byte; 2];
// array Uint32 [byte; 4];
//
// We will use the built-in ccc.mol for all this basic integers types.

/* ```attributes.mol
import common/basic_types;

/ Each role has 8 attributes. The size is fixed.
struct Attributes {
	strength:       AttrValue,
	dexterity:      AttrValue,
	endurance:      AttrValue,
	speed:          AttrValue,
	intelligence:   AttrValue,
	wisdom:         AttrValue,
	perception:     AttrValue,
	concentration:  AttrValue,
    }
```
*/
export interface Attributes {
  strength: AttrValue;
  dexterity: AttrValue;
  endurance: AttrValue;
  speed: AttrValue;
  intelligence: AttrValue;
  wisdom: AttrValue;
  perception: AttrValue;
  concentration: AttrValue;
}

export interface AttributesLike {
  strength: AttrValueLike;
  dexterity: AttrValueLike;
  endurance: AttrValueLike;
  speed: AttrValueLike;
  intelligence: AttrValueLike;
  wisdom: AttrValueLike;
  perception: AttrValueLike;
  concentration: AttrValueLike;
}

export const AttributesCodec: mol.Codec<AttributesLike, Attributes> =
  mol.struct({
    strength: AttrValueCodec,
    dexterity: AttrValueCodec,
    endurance: AttrValueCodec,
    speed: AttrValueCodec,
    intelligence: AttrValueCodec,
    wisdom: AttrValueCodec,
    perception: AttrValueCodec,
    concentration: AttrValueCodec,
  });

/* ```skills.mol
import common/basic_types;

/ We define several skills.
/ None means the role can learn a skill but he/she doesn't learn it.
option ArmorLight       (SkillLevel);
option ArmorHeavy       (SkillLevel);   // only Fighter can learn this
option ArmorShields     (SkillLevel);   // only Fighter can learn this
option WeaponSwords     (SkillLevel);   // only Mage can't learn this
option WeaponBows       (SkillLevel);   // only Ranger can learn this
option WeaponBlunt      (SkillLevel);
option Dodge            (SkillLevel);
option PickLocks        (SkillLevel);
option Mercantile       (SkillLevel);
option Survival         (SkillLevel);
/ ... omit other skills ...

/ Any skill which is defined above.
union Skill {
    ArmorLight,
    ArmorHeavy,
    ArmorShields,
    WeaponSwords,
    WeaponBows,
    WeaponBlunt,
    Dodge,
    PickLocks,
    Mercantile,
    Survival,
    / ... omit other skills ...
}

/ A hero can learn several skills. The size of learned skills is dynamic.
vector Skills <Skill>;
```
*/

export type ArmorLight = SkillLevel;
export type ArmorHeavy = SkillLevel;
export type ArmorShields = SkillLevel;
export type WeaponSwords = SkillLevel;
export type WeaponBows = SkillLevel;
export type WeaponBlunt = SkillLevel;
export type Dodge = SkillLevel;
export type PickLocks = SkillLevel;
export type Mercantile = SkillLevel;
export type Survival = SkillLevel;

export type ArmorLightLike = SkillLevelLike;
export type ArmorHeavyLike = SkillLevelLike;
export type ArmorShieldsLike = SkillLevelLike;
export type WeaponSwordsLike = SkillLevelLike;
export type WeaponBowsLike = SkillLevelLike;
export type WeaponBluntLike = SkillLevelLike;
export type DodgeLike = SkillLevelLike;
export type PickLocksLike = SkillLevelLike;
export type MercantileLike = SkillLevelLike;
export type SurvivalLike = SkillLevelLike;

export type Skill =
  | {type: "ArmorLight"; value: ArmorLight | undefined | null}
  | {type: "ArmorHeavy"; value: ArmorHeavy | undefined | null}
  | {type: "ArmorShields"; value: ArmorShields | undefined | null}
  | {type: "WeaponSwords"; value: WeaponSwords | undefined | null}
  | {type: "WeaponBows"; value: WeaponBows | undefined | null}
  | {type: "WeaponBlunt"; value: WeaponBlunt | undefined | null}
  | {type: "Dodge"; value: Dodge | undefined | null}
  | {type: "PickLocks"; value: PickLocks | undefined | null}
  | {type: "Mercantile"; value: Mercantile | undefined | null}
  | {type: "Survival"; value: Survival | undefined | null};

export type SkillLike =
| {type: "ArmorLight"; value: ArmorLightLike | undefined | null}
| {type: "ArmorHeavy"; value: ArmorHeavyLike | undefined | null}
| {type: "ArmorShields"; value: ArmorShieldsLike | undefined | null}
| {type: "WeaponSwords"; value: WeaponSwordsLike | undefined | null}
| {type: "WeaponBows"; value: WeaponBowsLike | undefined | null}
| {type: "WeaponBlunt"; value: WeaponBluntLike | undefined | null}
| {type: "Dodge"; value: DodgeLike | undefined | null}
| {type: "PickLocks"; value: PickLocksLike | undefined | null}
| {type: "Mercantile"; value: MercantileLike | undefined | null}
| {type: "Survival"; value: SurvivalLike | undefined | null};

export type Skills = Skill[];
export type SkillsLike = SkillLike[];

export const ArmorLightCodec: mol.Codec<
  ArmorLightLike | undefined | null,
  ArmorLight | undefined | null
> = mol.option(SkillLevelCodec);
export const ArmorHeavyCodec: mol.Codec<
  ArmorHeavyLike | undefined | null,
  ArmorHeavy | undefined | null
> = mol.option(SkillLevelCodec);
export const ArmorShieldsCodec: mol.Codec<
  ArmorShieldsLike | undefined | null,
  ArmorShields | undefined | null
> = mol.option(SkillLevelCodec);
export const WeaponSwordsCodec: mol.Codec<
  WeaponSwordsLike | undefined | null,
  WeaponSwords | undefined | null
> = mol.option(SkillLevelCodec);
export const WeaponBowsCodec: mol.Codec<
  WeaponBowsLike | undefined | null,
  WeaponBows | undefined | null
> = mol.option(SkillLevelCodec);
export const WeaponBluntCodec: mol.Codec<
  WeaponBluntLike | undefined | null,
  WeaponBlunt | undefined | null
> = mol.option(SkillLevelCodec);
export const DodgeCodec: mol.Codec<
  DodgeLike | undefined | null,
  Dodge | undefined | null
> = mol.option(SkillLevelCodec);
export const PickLocksCodec: mol.Codec<
  PickLocksLike | undefined | null,
  PickLocks | undefined | null
> = mol.option(SkillLevelCodec);
export const MercantileCodec: mol.Codec<
  MercantileLike | undefined | null,
  Mercantile | undefined | null
> = mol.option(SkillLevelCodec);
export const SurvivalCodec: mol.Codec<
  SurvivalLike | undefined | null,
  Survival | undefined | null
> = mol.option(SkillLevelCodec);

export const SkillCodec: mol.Codec<SkillLike, Skill> = mol.union({
  ArmorLight: ArmorLightCodec,
  ArmorHeavy: ArmorHeavyCodec,
  ArmorShields: ArmorShieldsCodec,
  WeaponSwords: WeaponSwordsCodec,
  WeaponBows: WeaponBowsCodec,
  WeaponBlunt: WeaponBluntCodec,
  Dodge: DodgeCodec,
  PickLocks: PickLocksCodec,
  Mercantile: MercantileCodec,
  Survival: SurvivalCodec,
});

export const SkillsCodec: mol.Codec<SkillsLike, Skills> = mol.vector(SkillCodec);

/* ```roles.mol
/ We have only 3 classes: Fighter, Ranger and Mage. A `byte` is enough.
array Class [byte; 1];

table Hero {
    class: Class,
    level: Uint8,
    experiences: Uint32,
    hp: Uint16,
    mp: Uint16,
    base_damage: Uint16,
    attrs: Attributes,
    skills: Skills,
}

table Monster {
    hp: Uint16,
    damage: Uint16,
}
```
*/
export type Class = number;
export type ClassLike = NumLike;
export const ClassCodec: mol.Codec<ClassLike, Class> = mol.Codec.from({
  byteLength: 1,
  encode: classToBytes,
  decode: classFromBytes,
});

export function classFrom(val: ClassLike): Class {
  if (typeof val === "number") {
    return val;
  }

  if (typeof val === "bigint") {
    return Number(val);
  }

  if (typeof val === "string") {
    return parseInt(val);
  }

  throw new Error(`Invalid class ${val}`);
}

export function classToBytes(val: ClassLike): Bytes {
  return bytesFrom([classFrom(val)]);
}

export function classFromBytes(bytes: BytesLike): Class {
  return classFrom(bytesFrom(bytes)[0]);
}

export interface Hero {
  class: Class;
  level: number;
  experiences: number;
  hp: number;
  mp: number;
  baseDamage: number;
  attrs: Attributes;
  skills: Skills;
}

export interface HeroLike {
  class: ClassLike;
  level: NumLike;
  experiences: NumLike;
  hp: NumLike;
  mp: NumLike;
  baseDamage: NumLike;
  attrs: AttributesLike;
  skills: SkillsLike;
}

export const HeroCodec: mol.Codec<HeroLike, Hero> = mol.table({
  class: ClassCodec,
  level: mol.Uint8,
  experiences: mol.Uint32,
  hp: mol.Uint16,
  mp: mol.Uint16,
  baseDamage: mol.Uint16,
  attrs: AttributesCodec,
  skills: SkillsCodec
});

export interface Monster {
  hp: number;
  damage: number;
}

export interface MonsterLike {
  hp: NumLike;
  damage: NumLike;
}

export const MonsterCodec: mol.Codec<MonsterLike, Monster> = mol.table({
  hp: mol.Uint16,
  damage: mol.Uint16,
});

// USAGE
// after we have defined all the schema files, 
// we can use them in our code pretty easily.
// 
// 1. Basic Usage
const myHero: Hero = {
  class: 1,
  level: 1,
  experiences: 0,
  hp: 100,
  mp: 100,
  baseDamage: 10,
  attrs: {
    strength: 10,
    dexterity: 10,
    endurance: 10,
    speed: 10,
    intelligence: 10,
    wisdom: 10,
    perception: 10,
    concentration: 10,
  },
  skills: [{type: "ArmorLight", value: 1}],
};

const myHeroBytes = HeroCodec.encode(myHero);
console.log("Hero mol serialized:", myHeroBytes);
console.log("Hero mol deserialized:", HeroCodec.decode(myHeroBytes));

// 2. advance usage
// ccc-molecule also supports decorators to generate classes
// from the schema files.
//
// For example, we can generate a class from the Monster schema file.
// using @mol.codec(MonsterCodec)
// You can also injecting custom methods
// for the generated classes.
@mol.codec(MonsterCodec)
export class Monster extends mol.Entity.Base<MonsterLike, Monster>() {
  constructor(monster: MonsterLike){
    super();

    this.hp = +ccc.numFrom(monster.hp).toString(10);
    this.damage = +ccc.numFrom(monster.damage).toString(10);
  }
  customMethod(){
    console.log("calling monster custom method");
  }
}

const myMonster = new Monster({hp: 100, damage: 10});
myMonster.customMethod();
console.log("monster mol serialized: ", myMonster.toBytes())
