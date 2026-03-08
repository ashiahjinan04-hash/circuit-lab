import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  BsCpu, 
  BsLightningCharge, 
  BsToggleOn, 
  BsLightbulb, 
  BsWrench, 
  BsListCheck, 
  BsArrowRight,
  BsTable
} from "react-icons/bs";

export default function CircuitGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const guides = [
    {
      id: "and-gate",
      title: "1. AND Gate using IC 7408",
      aim: "To implement and verify the operation of an AND gate.",
      components: [
        "IC 7408",
        "2 Input switches (A, B)",
        "1 LED (Output Y)",
        "Breadboard",
        "Connecting wires",
        "+5V power supply"
      ],
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          ["0", "0", "0"],
          ["0", "1", "0"],
          ["1", "0", "0"],
          ["1", "1", "1"]
        ]
      },
      steps: [
        "Place the 7408 IC on the breadboard.",
        "Connect Pin 14 to +5V and Pin 7 to GND.",
        "Connect Switch A to Pin 1 of the IC.",
        "Connect Switch B to Pin 2 of the IC.",
        "Connect Pin 3 (output) to an LED through a resistor.",
        "Connect the other side of the LED to GND.",
        "Turn on the power supply.",
        "Toggle switches A and B to test all input combinations."
      ],
      result: "The LED will turn ON only when both switches are ON, verifying the AND gate operation."
    },
    {
      id: "or-gate",
      title: "2. OR Gate using IC 7432",
      aim: "To verify the working of an OR gate.",
      components: [
        "IC 7432",
        "2 Switches",
        "1 LED",
        "Breadboard",
        "Connecting wires"
      ],
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          ["0", "0", "0"],
          ["0", "1", "1"],
          ["1", "0", "1"],
          ["1", "1", "1"]
        ]
      },
      steps: [
        "Insert 7432 IC into the breadboard.",
        "Connect Pin 14 to +5V and Pin 7 to GND.",
        "Connect Switch A to Pin 1.",
        "Connect Switch B to Pin 2.",
        "Connect Pin 3 (output) to an LED.",
        "Connect the LED to GND through a resistor.",
        "Turn on power and test different switch combinations."
      ],
      result: "The LED turns ON when at least one switch is ON."
    },
    {
      id: "not-gate",
      title: "3. NOT Gate using IC 7404",
      aim: "To implement a NOT gate (Inverter).",
      components: [
        "IC 7404",
        "1 Switch",
        "1 LED",
        "Breadboard",
        "Connecting wires"
      ],
      truthTable: {
        headers: ["A", "Y"],
        rows: [
          ["0", "1"],
          ["1", "0"]
        ]
      },
      steps: [
        "Place 7404 IC on the breadboard.",
        "Connect Pin 14 to +5V and Pin 7 to GND.",
        "Connect Switch A to Pin 1.",
        "Connect Pin 2 (output) to the LED.",
        "Connect LED to GND through resistor.",
        "Turn on power and toggle the switch."
      ],
      result: "When the switch is ON, the LED turns OFF, and vice versa."
    },
    {
      id: "xor-gate",
      title: "4. XOR Gate using IC 7486",
      aim: "To implement an XOR gate.",
      components: [
        "IC 7486",
        "2 Switches",
        "1 LED",
        "Breadboard",
        "Connecting wires"
      ],
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          ["0", "0", "0"],
          ["0", "1", "1"],
          ["1", "0", "1"],
          ["1", "1", "0"]
        ]
      },
      steps: [
        "Insert 7486 IC into the breadboard.",
        "Connect Pin 14 to +5V and Pin 7 to GND.",
        "Connect Switch A to Pin 1.",
        "Connect Switch B to Pin 2.",
        "Connect Pin 3 to the LED.",
        "Connect LED to GND through resistor.",
        "Turn on power and test all combinations."
      ],
      result: "LED lights only when inputs are different."
    },
    {
      id: "half-adder",
      title: "5. Half Adder",
      aim: "To design and test a Half Adder.",
      components: [
        "IC 7486 (XOR)",
        "IC 7408 (AND)",
        "2 Switches",
        "2 LEDs (Sum, Carry)"
      ],
      truthTable: {
        headers: ["A", "B", "Sum", "Carry"],
        rows: [
          ["0", "0", "0", "0"],
          ["0", "1", "1", "0"],
          ["1", "0", "1", "0"],
          ["1", "1", "0", "1"]
        ]
      },
      steps: [
        "Place 7486 and 7408 ICs on the breadboard.",
        "Connect VCC (Pin 14) to +5V and Pin 7 to GND for both ICs.",
        "Connect Switch A and B to the inputs of the XOR gate.",
        "Connect XOR output to LED1 (Sum).",
        "Connect inputs A and B to the AND gate.",
        "Connect AND output to LED2 (Carry).",
        "Turn on power and test all input combinations."
      ],
      result: "The circuit correctly produces Sum and Carry outputs."
    },
    {
      id: "full-adder",
      title: "6. Full Adder",
      aim: "To implement a Full Adder.",
      components: [
        "IC 7486 (XOR)",
        "IC 7408 (AND)",
        "IC 7432 (OR)",
        "3 Switches (A, B, Carry in)",
        "2 LEDs (Sum, Carry out)"
      ],
      // Let's add the Full Adder truth table since the prompt didn't strictly give the row content but indicated its existence 
      // (Actually prompt didn't include one, but I'll add "Test all input combinations" in steps, let's keep it simple or create the table)
      truthTable: {
        headers: ["A", "B", "Cin", "Sum", "Cout"],
        rows: [
          ["0", "0", "0", "0", "0"],
          ["0", "0", "1", "1", "0"],
          ["0", "1", "0", "1", "0"],
          ["0", "1", "1", "0", "1"],
          ["1", "0", "0", "1", "0"],
          ["1", "0", "1", "0", "1"],
          ["1", "1", "0", "0", "1"],
          ["1", "1", "1", "1", "1"]
        ]
      },
      steps: [
        "Place all three ICs on the breadboard.",
        "Connect Pin 14 to +5V and Pin 7 to GND for each IC.",
        "Connect switches A and B to XOR gate.",
        "Connect XOR output to another XOR with Carry input.",
        "Connect the final XOR output to Sum LED.",
        "Use AND gates to generate intermediate carry signals.",
        "Combine carry outputs using OR gate.",
        "Connect OR output to Carry LED.",
        "Test all input combinations."
      ],
      result: "The circuit performs three-bit binary addition."
    }
  ];

  return (
    <div className="min-h-screen bg-[#031327] text-white flex flex-col pt-20">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 mb-6 mt-8">
              <span className="neon-text">Circuit Guide</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto glass p-6 rounded-2xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
              Circuit Lab allows users to design and test digital circuits using a virtual breadboard. By connecting logic ICs, switches, LEDs, and wires, users can implement digital circuits and verify their outputs.
            </p>
          </div>

          {/* Guides List */}
          <div className="space-y-12">
            {guides.map((guide, index) => (
              <div 
                key={guide.id} 
                className="glass rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-colors duration-300"
              >
                <div className="bg-slate-800/50 p-6 border-b border-slate-700/50 flex items-center gap-4">
                  <div className="bg-cyan-500/20 text-cyan-300 p-3 rounded-xl">
                    <BsCpu size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">{guide.title}</h2>
                </div>
                
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Aim */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                        <BsLightbulb /> Aim
                      </h3>
                      <p className="text-slate-300 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                        {guide.aim}
                      </p>
                    </div>

                    {/* Components */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                        <BsWrench /> Components Required
                      </h3>
                      <ul className="text-slate-300 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 space-y-2">
                        {guide.components.map((comp, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                            {comp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Truth Table */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                        <BsTable /> Truth Table
                      </h3>
                      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-800/80">
                              {guide.truthTable.headers.map((h, i) => (
                                <th key={i} className="p-3 border-b border-slate-700 text-slate-200 font-semibold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {guide.truthTable.rows.map((row, i) => (
                              <tr key={i} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 transition-colors">
                                {row.map((cell, j) => (
                                  <td key={j} className="p-3 text-slate-300">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {/* Steps */}
                  <div className="space-y-2 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                      <BsListCheck /> Steps to Build the Circuit
                    </h3>
                    <div className="text-slate-300 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 flex-grow">
                      <ol className="space-y-4">
                        {guide.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-sm font-bold border border-cyan-500/30 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                      <BsLightningCharge /> Expected Result
                    </h3>
                    <div className="text-emerald-100 bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30 font-medium">
                      {guide.result}
                    </div>
                  </div>
                </div>

                </div>
                
                {/* Optional: Add an action button linking to build page */}
                <div className="bg-slate-800/30 p-4 border-t border-slate-700/50 flex justify-end">
                   <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      Try it out <BsArrowRight />
                   </Link>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Ready to apply what you've learned?</h2>
            <Link
              to="/dashboard"
              className="inline-block btn-neon text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:scale-[1.02] transition transform text-lg"
            >
              Go to Circuit Builder
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
