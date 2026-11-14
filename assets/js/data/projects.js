/**
 * Project and task data used by the donation panel.
 *
 * Task prices are carried over from the live site (main branch). They still
 * need sign-off from the foundation, together with the progress figures shown
 * on the project cards, before being treated as current.
 */
export const PROJECTS = {
  borehole: {
    name: "Borehole construction",
    tasks: [
      ["Drill borehole", 2000],
      ["Water pump installation", 2400],
      ["Tank & piping", 1600],
      ["Water tower construction", 2000],
      ["Solar electrical system", 4000],
    ],
  },
  bus: {
    name: "School bus",
    tasks: [
      ["Fairly used bus", 25000],
      ["Brand new bus", 60000],
    ],
  },
  classroom: {
    name: "Classroom completion",
    tasks: [
      ["Flooring & plastering", 1000],
      ["Windows & doors", 350],
      ["Painting a classroom", 500],
      ["Ceiling & fittings", 800],
      ["Electrification", 350],
    ],
  },
  landscaping: {
    name: "School landscaping",
    tasks: [
      ["Plant trees", 1000],
      ["Playground setup", 2000],
      ["Garden maintenance", 1000],
    ],
  },
  electrification: {
    name: "Electrification",
    tasks: [
      ["Wiring", 1500],
      ["Electric poles", 2000],
      ["Switches & outlets", 1500],
    ],
  },
  lab: {
    name: "Science laboratory",
    tasks: [
      ["Lab construction", 15000],
      ["Equipment", 10000],
      ["Safety gear & materials", 5000],
    ],
  },
  "computer-lab": {
    name: "Computer laboratory",
    tasks: [
      ["Lab construction", 10000],
      ["Computers", 10000],
      ["Furniture & chairs", 2000],
      ["Networking & cables", 3000],
    ],
  },
  library: {
    name: "Library",
    tasks: [
      ["Library construction", 10000],
      ["Books", 2000],
      ["Shelves & furniture", 3500],
    ],
  },
  staff_payment: {
    name: "Staff support",
    tasks: [["Support a teacher for a month", 250]],
  },
};
