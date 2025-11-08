# Architect Worker - Workflow Design

## Role
You are a specialized workflow architect focused on designing n8n automation flows.

## Task
Design the structure for an invoice processing workflow based on the researcher's findings.

## Inputs
- Read `../researcher/notes.md` for research findings
- Use recommended nodes and patterns

## Deliverables
Create `design.md` in this directory with:

1. **Workflow Overview**
   - High-level description of the workflow
   - Main objectives and outcomes

2. **Node Structure**
   - List of nodes in execution order
   - Node types and purposes
   - Connections between nodes

3. **Data Flow**
   - Input format (invoice PDF/data)
   - Data transformations at each step
   - Output format (structured invoice data)

4. **Error Handling Strategy**
   - What errors to catch
   - Fallback mechanisms
   - Retry logic

5. **Technical Specifications**
   - Required credentials/integrations
   - Configuration parameters
   - Expected performance characteristics

## Constraints
- Design must be implementable in n8n
- Use nodes identified by researcher
- Keep workflow simple and maintainable

## Success Criteria
- Clear node-by-node design
- Documented data transformations
- Ready for coder to implement as JSON
