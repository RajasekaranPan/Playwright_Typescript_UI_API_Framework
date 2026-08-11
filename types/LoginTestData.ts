export interface LoginTestData { 
    TestCaseId: string; 
    Scenario: string; 
    UsernameKey: string; 
    PasswordKey: string; 
    ExpectedResult: 'success' | 'failure'; 
}