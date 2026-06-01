# Software Design Patterns Study Guide

---

## 1. What Is a Design Pattern?

A **design pattern** is a named solution to a common software design problem.

Design patterns help developers speak a shared language. Instead of explaining a long architectural idea every time, developers can say things like:

- “This looks like a Strategy.”
- “We should use a Repository here.”
- “This dependency should be injected.”

Patterns are not magic solutions. They are tools. A pattern is useful only when it removes more complexity than it adds.

---

## 2. The Three Main Categories

| Category | Main Question | Examples |
|---|---|---|
| Creational Patterns | How are objects created? | Factory, Builder, Singleton |
| Structural Patterns | How are objects connected? | Repository, Dependency Injection, Decorator |
| Behavioural Patterns | How do objects behave and communicate at runtime? | Observer, Strategy, State Machine |

---

# Part 1: Creational Patterns

Creational patterns focus on object creation.

At first, creating an object looks simple:

```ts
new SomeClass();
```

But in real projects, object creation can become complicated. A class may need to choose between different implementations, configure many options, or reuse shared resources.

Creational patterns separate two responsibilities:

1. One part of the program says: “I need this kind of object.”
2. Another part decides which concrete class to create and how to configure it.

This makes the code easier to change, test, and extend.

---

## 3. Factory Pattern

### Problem

A class needs different concrete objects depending on runtime input.

Without a factory, the class may contain a long `if / else` or `switch` chain and know too much about concrete classes.

Example problem:

```ts
class Player {
  load(file: AudioFile) {
    let decoder: Decoder;

    if (file.format === "mp3") decoder = new Mp3Decoder();
    else if (file.format === "flac") decoder = new FlacDecoder();
    else if (file.format === "wav") decoder = new WavDecoder();
    else throw new Error(`Unsupported format: ${file.format}`);

    decoder.decode(file.buffer);
  }
}
```

The `Player` should play audio, but now it also knows how to create every decoder.

### Solution

Move object creation into a factory function or factory class.

```ts
export interface Decoder {
  decode(buffer: Buffer): AudioFrame[];
}

export function createDecoder(format: AudioFormat): Decoder {
  switch (format) {
    case "mp3":
      return new Mp3Decoder();
    case "flac":
      return new FlacDecoder();
    case "wav":
      return new WavDecoder();
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

class Player {
  load(file: AudioFile) {
    const decoder = createDecoder(file.format);
    decoder.decode(file.buffer);
  }
}
```

### Why It Helps

The `Player` now depends only on the `Decoder` interface. It does not need to know all concrete decoder classes.

If a new format is added, for example `ogg`, only the factory needs to change. The `Player` stays untouched.

### Mental Model

A factory is like ordering from a menu. You say what you want, and the kitchen decides how to prepare it.

### Use Factory When

- You need to create different classes based on runtime data.
- The caller should not know the concrete class.
- You want to avoid repeated creation logic.

### Avoid Factory When

- There is only one class to create.
- Object creation is simple and unlikely to change.
- The factory would only wrap `new SomeClass()` without adding value.

---

## 4. Builder Pattern

### Problem

An object has many optional configuration values.

Without a builder, you may get a long constructor with many `undefined` values.

```ts
const query = new PlaylistQuery(
  undefined, // year
  "Daft Punk", // artist
  undefined, // minDuration
  240, // maxDuration
  true, // shuffle
);
```

This is hard to read. You must count parameters to understand what each value means.

### Solution

Use a builder object that creates another object step by step.

```ts
export class PlaylistQueryBuilder {
  private filters: Partial<QueryFilters> = {};

  releasedAfter(year: number): this {
    this.filters.year = year;
    return this;
  }

  byArtist(name: string): this {
    this.filters.artist = name;
    return this;
  }

  shorterThan(seconds: number): this {
    this.filters.maxDuration = seconds;
    return this;
  }

  shuffled(): this {
    this.filters.shuffle = true;
    return this;
  }

  build(): PlaylistQuery {
    if (this.filters.minDuration && this.filters.maxDuration) {
      if (this.filters.minDuration > this.filters.maxDuration) {
        throw new Error("Invalid duration range");
      }
    }

    return new PlaylistQuery(this.filters);
  }
}

const query = new PlaylistQueryBuilder()
  .byArtist("Daft Punk")
  .shorterThan(240)
  .shuffled()
  .build();
```

### Important Details

- Each method returns `this`, which enables method chaining.
- `build()` is the only place where the final object is created.
- `build()` is a good place for validation.
- The final object can be immutable.
- The messy partial state stays inside the builder.

### Mental Model

A builder is like building a sandwich one ingredient at a time.

### Use Builder When

- Object construction happens in several steps.
- The object has many optional parts.
- Validation depends on multiple fields.
- You need to pass a half-built object around before finalizing it.

### Avoid Builder When

TypeScript often has a simpler solution: use a configuration object.

```ts
new PlaylistQuery({ artist: "Daft Punk", shuffle: true });
```

Use a real builder only when the construction process is complex enough to justify it.

---

## 5. Singleton Pattern

### Problem

Some resources should exist only once in the whole program.

Examples:

- A sound engine that controls a sound card.
- A hardware connection that cannot be opened twice.
- A unique system resource where multiple instances would break something.

### Solution

A Singleton allows exactly one instance of a class.

```ts
export class AudioEngine {
  private static instance: AudioEngine | null = null;

  private constructor(private readonly sampleRate: number) {}

  static initialize(sampleRate: number): AudioEngine {
    if (this.instance) {
      throw new Error("AudioEngine is already initialized");
    }

    this.instance = new AudioEngine(sampleRate);
    return this.instance;
  }

  static getInstance(): AudioEngine {
    if (!this.instance) {
      throw new Error("AudioEngine must be initialized first");
    }

    return this.instance;
  }

  play(buffer: AudioFrame[]): void {
    // talks to the sound card
  }
}
```

### Important Details

- The constructor is `private`, so nobody can call `new AudioEngine()` from outside.
- The static `instance` field stores the single object.
- `initialize()` creates the instance once.
- `getInstance()` returns the same instance everywhere.

### Mental Model

One key for one lock.

### Use Singleton When

- Having two instances would actually break something.
- The object owns a real-world limited resource.
- The single-instance rule is part of the domain problem.

### Avoid Singleton When

Do not use Singleton just because global access is convenient.

Bad example:

```ts
class TrackService {
  play(track: Track) {
    Logger.getInstance().info(`Played ${track.title}`);
  }
}
```

The dependency on `Logger` is hidden inside the method. This makes testing harder because the real logger may write to disk or send network requests.

A better default is to pass dependencies through the constructor using Dependency Injection.

---

# Part 2: Structural Patterns

Structural patterns focus on how objects are connected.

They help prevent tightly coupled code where changing one class forces changes in many other places.

Without structural patterns:

- Classes are hard to test.
- Dependencies are hidden.
- Swapping one implementation for another is difficult.
- Business logic gets mixed with database logic, logging, formatting, or infrastructure details.

---

## 6. Repository Pattern

### Problem

Business logic talks directly to the database.

```ts
class PlayerService {
  async play(trackId: number) {
    const { rows } = await pgPool.query(
      "SELECT id, title, artist, format FROM tracks WHERE id = $1",
      [trackId],
    );

    const track = rows[0];
    if (!track) throw new Error(`Track ${trackId} not found`);

    AudioEngine.getInstance().play(track);
  }
}
```

Problems:

- `PlayerService` is bound to PostgreSQL.
- Testing requires a real database.
- SQL is mixed with player logic.
- Changing the storage system means changing business logic.

### Solution

Create a repository interface that describes data access in domain language.

```ts
export interface Track {
  id: number;
  title: string;
  artist: string;
  format: AudioFormat;
}

export interface TrackRepository {
  findById(id: number): Promise<Track | null>;
  findByArtist(artist: string): Promise<Track[]>;
  save(track: Track): Promise<void>;
}
```

Then create concrete implementations.

```ts
export class PostgresTrackRepository implements TrackRepository {
  constructor(private readonly pg: Pool) {}

  async findById(id: number): Promise<Track | null> {
    const { rows } = await this.pg.query(
      "SELECT id, title, artist, format FROM tracks WHERE id = $1",
      [id],
    );

    return rows[0] ?? null;
  }
}

export class InMemoryTrackRepository implements TrackRepository {
  private tracks = new Map<number, Track>();

  async findById(id: number): Promise<Track | null> {
    return this.tracks.get(id) ?? null;
  }
}
```

### Why It Helps

Code that depends on `TrackRepository` does not care where the data comes from.

In production, it can use PostgreSQL. In tests, it can use an in-memory repository.

### Repository vs Model

A **model** describes data and rules.

A **repository** describes how data is stored and retrieved.

Example:

- Model: What is a `User`?
- Repository: How do we find or save a `User`?

### Mental Model

A repository is like a librarian. You ask for a book by title or ID, not by shelf coordinates.

### Use Repository When

- Data access logic is leaking into business logic.
- You want to swap storage systems.
- You want easier tests without a real database.
- You want domain-friendly method names like `findById()` or `save()`.

### Avoid Repository When

- The project is tiny.
- You only have one simple data access call.
- The repository would only forward calls without simplifying anything.

---

## 7. Dependency Injection

### Problem

A class creates its own dependencies.

```ts
class PlayerService {
  private repo = new PostgresTrackRepository(pgPool);
  private engine = AudioEngine.getInstance();

  async play(trackId: number) {
    const track = await this.repo.findById(trackId);
    if (track) this.engine.play(track);
  }
}
```

The class is still locked to concrete implementations.

### Solution

Pass dependencies into the class from the outside, usually through the constructor.

```ts
class PlayerService {
  constructor(
    private readonly tracks: TrackRepository,
    private readonly engine: AudioEngine,
  ) {}

  async play(trackId: number) {
    const track = await this.tracks.findById(trackId);
    if (track) this.engine.play(track);
  }
}
```

The class declares what it needs, but it does not decide which concrete object it receives.

### Composition Root

The **composition root** is the place where the application creates and connects its main objects.

```ts
const service = new PlayerService(
  new PostgresTrackRepository(pgPool),
  AudioEngine.getInstance(),
);

const fakeEngine = { play: () => {} } as AudioEngine;
const testService = new PlayerService(
  new InMemoryTrackRepository(),
  fakeEngine,
);
```

Production uses real implementations. Tests use fake or in-memory implementations.

### Mental Model

The class says what it needs. The outside world decides what it gets.

### Use Dependency Injection When

- A class depends on another service, repository, logger, client, or engine.
- You want to test the class in isolation.
- You want to swap implementations without editing the class.

### Avoid Dependency Injection When

- The dependency is a simple value object created inside a method.
- Passing everything through constructors creates more noise than value.

---

## 8. Decorator Pattern

### Problem

You need to add repeated behaviour around methods.

Examples:

- Logging
- Timing
- Caching
- Retrying
- Permission checks

If you write this logic inside every method, the business logic becomes buried under boilerplate.

### Solution

A decorator wraps an existing method or object and adds extra behaviour before or after the original call.

```ts
function measure(originalMethod: any, context: ClassMethodDecoratorContext) {
  const name = String(context.name);

  return function (this: any, ...args: any[]) {
    const start = performance.now();
    const result = originalMethod.call(this, ...args);
    const elapsed = performance.now() - start;

    console.log(`[measure] ${name} took ${elapsed.toFixed(2)}ms`);

    return result;
  };
}
```

Usage:

```ts
class PostgresTrackRepository implements TrackRepository {
  constructor(private readonly pg: Pool) {}

  @measure
  async findById(id: number) {
    const { rows } = await this.pg.query(
      "SELECT id, title, artist, format FROM tracks WHERE id = $1",
      [id],
    );

    return rows[0] ?? null;
  }
}
```

Now `findById()` only contains database logic. The measuring logic is reusable and separate.

### Mental Model

Toppings on a pizza. The base stays the same, but extra behaviour is added around it.

### Use Decorator When

- You need the same extra behaviour in many places.
- The extra behaviour is not part of the core business logic.
- You want reusable wrappers around methods.

### Avoid Decorator When

- A simple function call would be clearer.
- The decorator hides too much behaviour.
- Debugging becomes harder because the real execution path is no longer obvious.

---

# Part 3: Behavioural Patterns

Behavioural patterns focus on what objects do while the program is running and how they coordinate.

Typical symptoms:

- One class notifies many unrelated systems directly.
- One method has a growing `if / else` chain for different algorithms.
- One class uses several boolean flags and can enter invalid states.

---

## 9. Observer Pattern

### Problem

A class directly notifies many other systems.

```ts
class Player {
  constructor(
    private readonly scrobbler: Scrobbler,
    private readonly recommender: RecommendationEngine,
    private readonly analytics: Analytics,
  ) {}

  play(track: Track) {
    AudioEngine.getInstance().play(track);
    this.scrobbler.recordPlay(track);
    this.recommender.update(track);
    this.analytics.track("track.played", { id: track.id });
  }
}
```

Every new feature adds another dependency and another method call inside `play()`.

The `Player` slowly becomes a control panel for half the application.

### Solution

The subject emits events. Other systems subscribe to those events.

```ts
type PlayerEvent =
  | { type: "track.played"; track: string }
  | { type: "track.finished"; track: string };

type Listener = (event: PlayerEvent) => void;

class MusicPlayerBus {
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  emit(event: PlayerEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
```

Usage:

```ts
const player = new MusicPlayerBus();

player.subscribe((event: PlayerEvent) => {
  if (event.type === "track.played") {
    console.log("Now playing:", event.track);
  }

  if (event.type === "track.finished") {
    console.log("Track finished:", event.track);
  }
});

player.emit({ type: "track.played", track: "Bohemian Rhapsody" });
```

### Important Methods

- `subscribe(handler)` registers a listener.
- `emit(event)` sends the event to all listeners.

### Mental Model

A radio station. Anyone can tune in, but the station does not know every listener personally.

### Use Observer When

- Several independent systems need to react to the same event.
- The subject should not know who listens to it.
- You want to add or remove listeners without changing the subject.

### Avoid Observer When

- There are only one or two tightly related calls.
- Event flow becomes hard to follow.
- The system becomes full of hidden side effects.

---

## 10. Strategy Pattern

### Problem

A method chooses between several algorithms with a flag.

```ts
class Player {
  mode: "sequential" | "shuffle" | "repeat-one" = "sequential";

  nextTrack(currentIndex: number, playlistLength: number): number {
    if (this.mode === "sequential") {
      return currentIndex + 1 < playlistLength ? currentIndex + 1 : -1;
    } else if (this.mode === "shuffle") {
      return Math.floor(Math.random() * playlistLength);
    } else {
      return currentIndex;
    }
  }
}
```

Each new mode adds another branch to the same method.

### Solution

Move each algorithm into its own class with a shared interface.

```ts
export interface PlaybackStrategy {
  next(currentIndex: number, playlistLength: number): number;
}

export class Sequential implements PlaybackStrategy {
  next(currentIndex: number, playlistLength: number) {
    return currentIndex + 1 < playlistLength ? currentIndex + 1 : -1;
  }
}

export class Shuffle implements PlaybackStrategy {
  next(_currentIndex: number, playlistLength: number) {
    return Math.floor(Math.random() * playlistLength);
  }
}
```

The player delegates to the active strategy.

```ts
class Player {
  constructor(private strategy: PlaybackStrategy) {}

  setStrategy(strategy: PlaybackStrategy) {
    this.strategy = strategy;
  }

  nextTrack(currentIndex: number, playlistLength: number): number {
    return this.strategy.next(currentIndex, playlistLength);
  }
}
```

### Why It Helps

Changing the algorithm at runtime is easy:

```ts
player.setStrategy(new Shuffle());
```

Adding a new algorithm means creating a new strategy class. The `Player` does not need to change.

### Mental Model

A power tool with different drill bits.

### Use Strategy When

- A class needs to switch between algorithms.
- A method has a growing `if / else` chain.
- You want to add new behaviours without changing the main class.

### Avoid Strategy When

- There are only two simple branches.
- The logic is unlikely to grow.
- Separate classes would make the code harder to read.

---

## 11. State Machine Pattern

### Problem

A class uses several boolean fields to describe its state.

```ts
class Player {
  isLoading = false;
  isPlaying = false;
  isPaused = false;

  pause() {
    this.isPlaying = false;
    this.isPaused = true;
  }
}
```

Three booleans create eight possible combinations, but only a few are valid.

Invalid examples:

- `isPlaying === true` and `isPaused === true`
- `isLoading === true` and `isPaused === true`

Nothing prevents impossible states.

### Solution

Use one state field and a transition table.

```ts
type PlayerState = "idle" | "loading" | "playing" | "paused";
type PlayerEvent = "load" | "ready" | "pause" | "resume" | "stop" | "error";

const transitions: Record<
  PlayerState,
  Partial<Record<PlayerEvent, PlayerState>>
> = {
  idle: { load: "loading" },
  loading: { ready: "playing", error: "idle" },
  playing: { pause: "paused", stop: "idle" },
  paused: { resume: "playing", stop: "idle" },
};

class Player {
  private state: PlayerState = "idle";

  transition(event: PlayerEvent) {
    const next = transitions[this.state][event];

    if (!next) {
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    }

    this.state = next;
  }

  pause() {
    this.transition("pause");
  }
}
```

### Why It Helps

The object can only be in one valid state at a time.

Illegal transitions throw clear errors instead of silently corrupting state.

### Mental Model

A traffic light. It can only be one color at a time, and transitions must follow the rules.

### Use State Machine When

- An object has a clear lifecycle.
- Some actions are only legal in specific states.
- Boolean flags create invalid combinations.
- You want the code to enforce state rules.

### Avoid State Machine When

- The state is very simple.
- There are no illegal transitions.
- A basic enum or union type is enough.

---