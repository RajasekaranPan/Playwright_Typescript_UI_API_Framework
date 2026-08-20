                        Excel
                           │
                           ▼
                 EmployeeDataProvider
                           │
                           │ existing employee
                           ▼
                 ScenarioDataFactory
                    │              │
                    │              │
              Business Rule        │
                    │              │
                    └──────┬───────┘
                           ▼
                DependentDataFactory
                           │
                           ▼
                    @faker-js/faker
                           │
                           ▼
                  Generated Dependent
                           │
                           ▼
                    dependents.json
