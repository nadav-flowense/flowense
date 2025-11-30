import { MermaidEditor } from '@/components/diagrams';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/diagrams/')({
  component: DiagramsPage,
});

function DiagramsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Diagram Editor</h1>
        <p className="text-muted-foreground mt-2">
          Create and preview Mermaid diagrams with live rendering
        </p>
      </div>

      <MermaidEditor />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Example Diagrams</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ExampleCard
            title="Flowchart"
            code={`flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`}
          />
          <ExampleCard
            title="Sequence Diagram"
            code={`sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B-->>A: Hi Alice!
    A->>B: How are you?
    B-->>A: I'm good, thanks!`}
          />
          <ExampleCard
            title="Class Diagram"
            code={`classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +bark()
    }
    class Cat {
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`}
          />
          <ExampleCard
            title="State Diagram"
            code={`stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Error: Fail
    Success --> [*]
    Error --> Idle: Retry`}
          />
          <ExampleCard
            title="ER Diagram"
            code={`erDiagram
    USER ||--o{ ORDER : places
    USER {
        string id PK
        string name
        string email
    }
    ORDER ||--|{ LINE_ITEM : contains
    ORDER {
        string id PK
        date created
    }`}
          />
          <ExampleCard
            title="Gantt Chart"
            code={`gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Research    :a1, 2024-01-01, 30d
    Design      :a2, after a1, 20d
    section Phase 2
    Development :a3, after a2, 60d
    Testing     :a4, after a3, 14d`}
          />
        </div>
      </div>
    </div>
  );
}

function ExampleCard({ title, code }: { title: string; code: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <button
          type="button"
          onClick={handleCopy}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Copy
        </button>
      </div>
      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
