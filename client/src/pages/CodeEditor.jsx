import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Box, Typography, Button, Grid, Paper, Tabs, Tab, Snackbar, Alert, 
  List, ListItem, ListItemIcon, ListItemText, LinearProgress,
  FormControl, InputLabel, Select, MenuItem, Chip, Divider, Card, CardContent, CardActions,
  CircularProgress, Backdrop, Fade, Modal
} from '@mui/material';
import { 
  PlayArrow, Save, ArrowBack, LightbulbOutlined, BarChart, Check, 
  MenuBook, Assignment, Code, Terminal, Assessment, Info,
  BugReport, Download, Upload, ContentCopy, ContentPaste, Bolt,
  Construction, Timer, Fingerprint, SmartToy, Loop, ArrowForward, Create
} from '@mui/icons-material';

const CodeEditor = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedModule, setSelectedModule] = useState(searchParams.get('module') || 'custom');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [exerciseData, setExerciseData] = useState({
    title: '',
    background: '',
    requirements: '',
    imageUrl: '',
    truthTable: [],
    testCases: [],
    hints: [],
    resources: []
  });
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showLoadingEffect, setShowLoadingEffect] = useState(false);
  const [isTerminalTyping, setIsTerminalTyping] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  // Available practice modules
  const practiceModules = [
    { id: 'custom', name: 'Custom Verilog Module', level: 'Any', category: 'Custom', isCustom: true },
    { id: 'full_adder', name: 'Full Adder', level: 'Beginner', category: 'Combinational' },
    { id: 'ripple_carry_adder', name: '4-bit Ripple Carry Adder', level: 'Beginner', category: 'Combinational' },
    { id: 'alu', name: '4-bit ALU', level: 'Intermediate', category: 'Combinational' },
    { id: 'counter', name: '4-bit Counter', level: 'Beginner', category: 'Sequential' },
    { id: 'shift_register', name: '8-bit Shift Register', level: 'Intermediate', category: 'Sequential' },
    { id: 'fsm_traffic', name: 'Traffic Light Controller FSM', level: 'Intermediate', category: 'Sequential' },
    { id: 'uart_tx', name: 'UART Transmitter', level: 'Advanced', category: 'Communication' },
    { id: 'memory_controller', name: 'Simple Memory Controller', level: 'Advanced', category: 'Memory' },
    { id: 'fifo', name: 'Synchronous FIFO', level: 'Advanced', category: 'Memory' },
  ];

  // Handle module selection change
  const handleModuleChange = (event) => {
    const moduleId = event.target.value;
    console.log("Selected module changed to:", moduleId); // Debug log
    setSelectedModule(moduleId);
    setSearchParams({ module: moduleId });
    // Reset output
    setOutput('');
    setConsoleOutput('');
    setTabValue(0);
    
    // Immediate feedback for selection change
    setNotification({
      open: true,
      message: `Module changed to: ${moduleId === 'custom' ? 'Custom Module' : 
        practiceModules.find(m => m.id === moduleId)?.name || moduleId}`,
      severity: 'info'
    });
  };

  // Simulate typing effect for terminal
  const simulateTyping = (text, speed = 30) => {
    setIsTerminalTyping(true);
    setTerminalText('');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setTerminalText(prev => prev + text.charAt(index));
        index++;
      } else {
        setIsTerminalTyping(false);
        clearInterval(interval);
      }
    }, speed);
  };

  // Handle run code button with futuristic loading effect
  const handleRunCode = () => {
    setShowLoadingEffect(true);
    setIsCompiling(true);
    
    // Show the feature coming soon modal after the loading effect
    setTimeout(() => {
      setShowLoadingEffect(false);
      setShowFeatureModal(true);
      setIsCompiling(false);
      
      // Simulate terminal typing effect
      simulateTyping(`> Initializing Verilog compiler...\n> Loading modules...\n> Establishing WebAssembly runtime...\n> ERROR: WebAssembly Verilog compiler not yet available in this build.\n\n> This feature is coming soon! Our engineers are working hard to bring Verilog compilation directly to your browser.`);
    }, 2500);
  };

  // Fetch data for the selected module
  useEffect(() => {
    console.log("useEffect triggered with selectedModule:", selectedModule); // Debug log
    
    // Reset outputs when changing modules
    setOutput('');
    setConsoleOutput('');
    
    // Simulate API call to get module data
    const fetchModuleData = () => {
      // Initial code template for different modules
      let initialCode = '';
      let exerciseInfo = {};
      
      console.log("Fetching data for module:", selectedModule); // Debug log
      
      switch(selectedModule) {
        case 'custom':
          initialCode = 
`module custom_module(
  // Define your inputs and outputs here
  input wire clk,  // Clock input
  input wire rst,  // Reset input
  input wire [7:0] data_in,  // 8-bit data input
  output reg [7:0] data_out  // 8-bit data output
);
  // Write your custom code here
  // This is a template you can modify as needed
  
  // Example: Simple register
  always @(posedge clk or posedge rst) begin
    if (rst) begin
      data_out <= 8'b0;  // Reset output to zero
    end else begin
      data_out <= data_in;  // Pass input to output on clock edge
    end
  end
  
  // You can delete the example and start from scratch
  
endmodule`;
          exerciseInfo = {
            title: 'Custom Verilog Module',
            background: 'Design your own digital circuit from scratch. Feel free to modify the template or start completely fresh.',
            requirements: 'Create any digital circuit that meets your specific requirements.',
            hints: [
              'Start by defining the inputs and outputs your module needs',
              'Decide if you need sequential logic (with clock) or combinational logic',
              'Remember that reg types should be assigned in always blocks with non-blocking (<=) assignments',
              'Use wire types for combinational logic with assign statements',
              'Test your design by thinking about different input scenarios'
            ],
            resources: [
              {
                title: "Verilog HDL Quick Reference Guide",
                description: "Comprehensive reference for Verilog syntax and common patterns",
                type: "Article",
                url: "https://www.ece.uvic.ca/~fayez/courses/ceng465/vlogref.pdf"
              },
              {
                title: "Verilog Online Simulator - EDA Playground",
                description: "Free browser-based Verilog simulator for testing your code",
                type: "Tool",
                url: "https://www.edaplayground.com/"
              },
              {
                title: "IEEE Standard Verilog Language Reference",
                description: "Official Verilog HDL language reference documentation",
                type: "Article",
                url: "https://ieeexplore.ieee.org/document/1620780"
              }
            ]
          };
          break;
          
        case 'full_adder':
          initialCode = 
`module full_adder(
  input wire a, b, cin,
  output wire sum, cout
);
  // Implement a full adder
  // Hint: sum = a ^ b ^ cin
  // Hint: cout = (a & b) | (cin & (a ^ b))
  
  // Write your code here
  wire a_xor_b;
  
  // Calculate sum
  
  
  // Calculate carry-out
  
  
endmodule`;
          exerciseInfo = {
            title: 'Full Adder',
            background: 'A full adder is a combinational circuit that performs the arithmetic sum of three input bits. It consists of three inputs and two outputs: the sum and carry-out.',
            requirements: 'Implement a 1-bit full adder using combinational logic.',
            imageUrl: 'https://www.researchgate.net/publication/329466923/figure/fig12/AS:701497183633415@1544299999838/A-full-adder-circuit-and-its-truth-table.png',
            truthTable: [
              { a: '0', b: '0', cin: '0', sum: '0', cout: '0' },
              { a: '0', b: '0', cin: '1', sum: '1', cout: '0' },
              { a: '0', b: '1', cin: '0', sum: '1', cout: '0' },
              { a: '0', b: '1', cin: '1', sum: '0', cout: '1' },
              { a: '1', b: '0', cin: '0', sum: '1', cout: '0' },
              { a: '1', b: '0', cin: '1', sum: '0', cout: '1' },
              { a: '1', b: '1', cin: '0', sum: '0', cout: '1' },
              { a: '1', b: '1', cin: '1', sum: '1', cout: '1' }
            ],
            testCases: [
              { 
                inputs: 'a=0, b=0, cin=0', 
                expectedOutputs: 'sum=0, cout=0', 
                explanation: 'No carries generated or propagated' 
              },
              { 
                inputs: 'a=1, b=1, cin=0', 
                expectedOutputs: 'sum=0, cout=1', 
                explanation: 'Carry generated from a AND b' 
              },
              { 
                inputs: 'a=1, b=1, cin=1', 
                expectedOutputs: 'sum=1, cout=1', 
                explanation: 'Sum of three 1s produces 11 binary' 
              }
            ],
            hints: [
              'Break down the logic into smaller parts - first calculate a XOR b',
              'The sum output can be implemented as a three-input XOR operation',
              'The carry-out has two conditions: when both a and b are 1, or when the carry-in is 1 and either a or b is 1',
              'Try using intermediate signals to improve code readability'
            ],
            resources: [
              {
                title: "Understanding Full Adders",
                description: "Tutorial on full adder implementation and design principles",
                type: "Article",
                url: "https://www.electronics-tutorials.ws/combination/comb_7.html",
                imageUrl: "https://www.electronics-tutorials.ws/wp-content/uploads/2018/05/combination-comb57.gif"
              },
              {
                title: "Full Adder Verilog Implementation",
                description: "Step-by-step guide to implementing a full adder in Verilog",
                type: "Tutorial",
                url: "https://www.fpga4student.com/2017/06/verilog-code-for-full-adder.html",
                imageUrl: "https://www.fpga4student.com/2017/06/images/Full%20adder%20circuit.png"
              },
              {
                title: "Full Adder Circuit Analysis",
                description: "Interactive simulation of full adder operation",
                type: "Simulation",
                url: "https://www.falstad.com/circuit/e-fulladd.html",
                imageUrl: "https://i.ytimg.com/vi/VycFxJYMSJU/maxresdefault.jpg"
              }
            ]
          };
          break;
          
        case 'ripple_carry_adder':
          initialCode = 
`module ripple_carry_adder(
  input wire [3:0] a, b,
  input wire cin,
  output wire [3:0] sum,
  output wire cout
);
  // Implement a 4-bit ripple carry adder
  // Hint: Use the full_adder module multiple times
  // Hint: Create wires to connect the carry between adders
  
  // Full adder module
  // module full_adder(
  //   input wire a, b, cin,
  //   output wire sum, cout
  // );
  
  // Write your code here
  // Define internal wires for carry propagation
  
  
  // Instantiate full adders
  
  
endmodule`;
          exerciseInfo = {
            title: '4-bit Ripple Carry Adder',
            background: 'A ripple carry adder is a digital circuit that produces the arithmetic sum of two binary numbers. It consists of multiple full adders connected in a chain, where the carry output of each full adder is connected to the carry input of the next full adder.',
            requirements: 'Implement a 4-bit ripple carry adder using full adders.',
            imageUrl: 'https://www.tutorialspoint.com/digital_circuits/images/ripple_carry_adder.jpg',
            testCases: [
              { 
                inputs: 'a=0000, b=0000, cin=0', 
                expectedOutputs: 'sum=0000, cout=0', 
                explanation: 'Basic case with all zeros' 
              },
              { 
                inputs: 'a=1010, b=0101, cin=0', 
                expectedOutputs: 'sum=1111, cout=0', 
                explanation: 'Alternating bits in inputs' 
              },
              { 
                inputs: 'a=1111, b=0001, cin=0', 
                expectedOutputs: 'sum=0000, cout=1', 
                explanation: 'Overflow case producing a carry' 
              },
              { 
                inputs: 'a=1111, b=1111, cin=0', 
                expectedOutputs: 'sum=1110, cout=1', 
                explanation: 'Addition of maximum values' 
              }
            ],
            hints: [
              'You need to instantiate four full adders and connect them properly',
              'Use wires to connect the carry out of one adder to the carry in of the next',
              'Make sure to connect the bits of a and b to the correct full adder instances',
              'Remember the cout of the last full adder is the cout of the entire adder'
            ],
            resources: [
              {
                title: "Ripple Carry Adder Design",
                description: "Comprehensive guide on ripple carry adder architecture",
                type: "Article",
                url: "https://www.geeksforgeeks.org/ripple-carry-adder-in-digital-logic/",
                imageUrl: "https://media.geeksforgeeks.org/wp-content/uploads/20220330114111/RippleCarryAdder.jpg"
              },
              {
                title: "Verilog Implementation of Ripple Carry Adder",
                description: "Step-by-step tutorial for implementing a 4-bit RCA",
                type: "Tutorial",
                url: "https://fpgatutorial.com/verilog-code-for-4-bit-ripple-carry-adder/",
                imageUrl: "https://m.media-amazon.com/images/I/714YhI22Z+L._AC_UF1000,1000_QL80_.jpg"
              },
              {
                title: "Ripple Carry Adder Performance Analysis",
                description: "Discussion of propagation delay and optimization techniques",
                type: "Paper",
                url: "https://www.researchgate.net/publication/318382682_Implementation_of_area_optimized_32-bit_Ripple_Carry_Adder_using_FPGA",
                imageUrl: "https://www.researchgate.net/publication/329466923/figure/fig11/AS:701497183637508@1544299999838/A-4-bit-ripple-carry-adder.png"
              }
            ]
          };
          break;
          
        case 'alu':
          initialCode = 
`module alu_4bit(
  input wire [3:0] a, b,
  input wire [1:0] op,
  output reg [3:0] result,
  output wire zero
);
  // Implement a 4-bit ALU with the following operations:
  // op = 00: ADD (a + b)
  // op = 01: SUB (a - b)
  // op = 10: AND (a & b)
  // op = 11: OR (a | b)
  // zero flag should be 1 when result is 0000
  
  // Write your code here
  
  
  // Zero flag
  
  
endmodule`;
          exerciseInfo = {
            title: '4-bit ALU (Arithmetic Logic Unit)',
            background: 'An ALU is a fundamental building block of a CPU. It performs arithmetic and logic operations on binary numbers. This 4-bit ALU supports addition, subtraction, AND, and OR operations.',
            requirements: 'Implement a 4-bit ALU with the specified operations and generate a zero flag when the result is 0.',
            imageUrl: 'https://www.researchgate.net/publication/329814067/figure/fig3/AS:704747588927488@1545034797815/Block-Diagram-of-ALU.png',
            testCases: [
              { 
                inputs: 'a=0101, b=0011, op=00 (ADD)', 
                expectedOutputs: 'result=1000, zero=0', 
                explanation: '5 + 3 = 8 (1000 in binary)' 
              },
              { 
                inputs: 'a=1000, b=0011, op=01 (SUB)', 
                expectedOutputs: 'result=0101, zero=0', 
                explanation: '8 - 3 = 5 (0101 in binary)' 
              },
              { 
                inputs: 'a=1001, b=0011, op=10 (AND)', 
                expectedOutputs: 'result=0001, zero=0', 
                explanation: '1001 & 0011 = 0001' 
              },
              { 
                inputs: 'a=1000, b=0011, op=11 (OR)', 
                expectedOutputs: 'result=1011, zero=0', 
                explanation: '1000 | 0011 = 1011' 
              },
              { 
                inputs: 'a=0011, b=0011, op=01 (SUB)', 
                expectedOutputs: 'result=0000, zero=1', 
                explanation: '3 - 3 = 0, setting zero flag to 1' 
              }
            ],
            hints: [
              'Use an always block with a case statement based on the op input',
              'For subtraction, remember that a - b is the same as a + (~b + 1)',
              'The zero flag should be set when all bits of the result are 0',
              'You can use a single assign statement with a reduction operator for the zero flag'
            ],
            resources: [
              {
                title: "ALU Architecture and Design",
                description: "Detailed explanation of ALU components and operations",
                type: "Article",
                url: "https://www.geeksforgeeks.org/arithmetic-logic-unit-alu/",
                imageUrl: "https://media.geeksforgeeks.org/wp-content/uploads/20200826194344/ALU.png"
              },
              {
                title: "Verilog Implementation of 4-bit ALU",
                description: "Tutorial on implementing ALU operations in Verilog",
                type: "Tutorial",
                url: "https://fpgatutorial.com/verilog-code-for-alu/",
                imageUrl: "https://verilogguide.readthedocs.io/en/latest/_images/alu_block_diagram.png"
              },
              {
                title: "RISC-V ALU Implementation Guide",
                description: "Advanced tutorial on implementing a RISC-V ALU",
                type: "PDF",
                url: "https://inst.eecs.berkeley.edu/~cs61c/resources/ALU.pdf",
                imageUrl: "https://www.researchgate.net/publication/330417703/figure/fig1/AS:714582543273987@1547375471915/Architecture-of-Arithmetic-Logic-Unit.png"
              }
            ]
          };
          break;
          
        case 'counter':
          initialCode = 
`module counter_4bit(
  input wire clk, reset, enable,
  output reg [3:0] count
);
  // Implement a 4-bit counter with:
  // - Synchronous active-high reset
  // - Enable input
  // - Count up on each clock cycle when enabled
  
  // Write your code here
  
  
endmodule`;
          exerciseInfo = {
            title: '4-bit Counter',
            background: 'A counter is a sequential circuit that counts through a specific sequence of states. This 4-bit counter increments its value by 1 on each clock cycle when enabled.',
            requirements: 'Implement a 4-bit counter with synchronous reset and enable inputs.',
            imageUrl: 'https://www.electronics-tutorials.ws/wp-content/uploads/2018/05/counter-count4.gif',
            testCases: [
              { 
                inputs: 'reset=1', 
                expectedOutputs: 'count=0000', 
                explanation: 'Reset operation sets counter to 0' 
              },
              { 
                inputs: 'reset=0, enable=1, count=0000', 
                expectedOutputs: 'count=0001 after clock', 
                explanation: 'Counter increments by 1 when enabled' 
              },
              { 
                inputs: 'reset=0, enable=0, count=0101', 
                expectedOutputs: 'count=0101 after clock', 
                explanation: 'Counter holds value when not enabled' 
              },
              { 
                inputs: 'reset=0, enable=1, count=1111', 
                expectedOutputs: 'count=0000 after clock', 
                explanation: 'Counter wraps around after reaching maximum value' 
              }
            ],
            hints: [
              'Use an always block triggered by the positive edge of the clock',
              'Handle the reset condition first, then the enable condition',
              'For incrementing, you can simply use count <= count + 1',
              'Make sure to use non-blocking assignments (<=) for sequential logic'
            ],
            resources: [
              {
                title: "Digital Counter Design",
                description: "Complete guide to digital counter design and implementation",
                type: "Article",
                url: "https://www.electronics-tutorials.ws/counter/count_1.html",
                imageUrl: "https://www.electronics-tutorials.ws/wp-content/uploads/2018/05/counter-count1.gif"
              },
              {
                title: "Verilog Counter Implementation",
                description: "Step-by-step tutorial for implementing counters in Verilog",
                type: "Tutorial",
                url: "https://www.chipverify.com/verilog/verilog-counter",
                imageUrl: "https://www.chipverify.com/images/verilog/synchronous_counter.png"
              },
              {
                title: "Counter Timing Simulation",
                description: "Interactive waveform simulation of counter operation",
                type: "Simulation",
                url: "https://www.fpga4student.com/2017/02/verilog-code-for-counter-on-fpga.html",
                imageUrl: "https://www.fpga4student.com/2017/02/images/testbench%20simulation%20waveforms.JPG"
              }
            ]
          };
          break;
          
        case 'fsm_traffic':
          initialCode = 
`module traffic_light_controller(
  input wire clk, reset, enable,
  output reg [2:0] highway_lights, farmroad_lights
);
  // Implement a traffic light controller:
  // - highway_lights and farmroad_lights: [RED, YELLOW, GREEN]
  // - Normal state: Highway Green, Farm Road Red
  // - When enable is high, start the sequence to let farm road traffic through
  // - Return to normal state when enable goes low
  // - Don't forget safety timing for yellow lights
  
  // Write your code here
  // Define state parameters
  
  
  // State register
  
  
  // State transition logic
  
  
  // Output logic
  
  
endmodule`;
          exerciseInfo = {
            title: 'Traffic Light Controller FSM',
            background: 'A traffic light controller is a perfect example of a Finite State Machine (FSM). This controller manages traffic lights at an intersection between a highway and a farm road, with priority given to the highway unless a vehicle is detected on the farm road.',
            requirements: 'Implement an FSM to control traffic lights with proper sequencing and safety timing.',
            imageUrl: 'https://www.researchgate.net/publication/337710855/figure/fig1/AS:831609219284993@1575016766327/A-finite-state-machine-diagram-for-a-simple-traffic-light-controller.ppm',
            testCases: [
              { 
                inputs: 'reset=1', 
                expectedOutputs: 'highway_lights=001 (GREEN), farmroad_lights=100 (RED)', 
                explanation: 'Initial state after reset' 
              },
              { 
                inputs: 'enable=1', 
                expectedOutputs: 'Sequence: Highway GREEN → YELLOW → RED, then Farm Road RED → GREEN', 
                explanation: 'Full sequence when vehicle detected on farm road' 
              },
              { 
                inputs: 'enable goes from 1 to 0 during farm road GREEN', 
                expectedOutputs: 'Complete current cycle through Farm Road YELLOW back to Highway GREEN', 
                explanation: 'Safe return to normal state' 
              }
            ],
            hints: [
              'Define state parameters for each state in the sequence',
              'Use one always block for the state register and reset logic',
              'Use another always block for next state logic based on current state and inputs',
              'Use a third always block for output logic based on current state',
              'Remember to use non-blocking assignments (<=) for sequential logic'
            ],
            resources: [
              {
                title: "Finite State Machine Design",
                description: "Guide to FSM design principles and implementation",
                type: "Article",
                url: "https://www.geeksforgeeks.org/mealy-and-moore-machines/",
                imageUrl: "https://qph.cf2.quoracdn.net/main-qimg-6c0abdd2a1d9d4ea63d91e5897dc14ad"
              },
              {
                title: "Traffic Light Controller Implementation",
                description: "Detailed tutorial on implementing a traffic light FSM in Verilog",
                type: "Tutorial",
                url: "https://www.fpga4student.com/2016/11/verilog-code-for-traffic-light-controller-design.html",
                imageUrl: "https://www.fpga4student.com/2016/11/images/Traffic%20light%20diagram.jpg"
              },
              {
                title: "FSM State Diagram Tool",
                description: "Interactive tool for designing and visualizing FSM state diagrams",
                type: "Tool",
                url: "https://state-machine-cat.js.org/",
                imageUrl: "https://res.cloudinary.com/practicaldev/image/fetch/s--0k_ggpHJ--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bh0z5cgr7zxsz9bzchxs.png"
              }
            ]
          };
          break;
          
        case 'uart_tx':
          initialCode = 
`module uart_transmitter(
  input wire clk, reset,
  input wire tx_start,
  input wire [7:0] tx_data,
  output reg tx_active,
  output reg tx_done,
  output reg tx_line
);
  // Implement a UART transmitter:
  // - 8 data bits, no parity, 1 stop bit
  // - tx_start initiates transmission
  // - tx_active indicates transmission in progress
  // - tx_done pulses for one clock cycle when transmission is complete
  // - tx_line is the serial output line (idle high)
  
  // Simplified - assume clock is already at the right baud rate
  
  // Write your code here
  
  
endmodule`;
          exerciseInfo = {
            title: 'UART Transmitter',
            background: 'UART (Universal Asynchronous Receiver Transmitter) is a serial communication protocol. The transmitter converts parallel data to serial format and transmits it with start and stop bits.',
            requirements: 'Implement a UART transmitter with 8 data bits, no parity, and 1 stop bit.',
            imageUrl: 'https://www.analog.com/-/media/images/analog-dialogue/en/volume-54/number-4/articles/uart-a-hardware-communication-protocol/335462-fig-01.svg?la=en&imgver=2',
            testCases: [
              { 
                inputs: 'tx_start=1, tx_data=10101010', 
                expectedOutputs: 'tx_line sequence: 0 (start), 0,1,0,1,0,1,0,1 (data), 1 (stop)', 
                explanation: 'Transmission of alternating bit pattern' 
              },
              { 
                inputs: 'During transmission', 
                expectedOutputs: 'tx_active=1', 
                explanation: 'Active flag during transmission' 
              },
              { 
                inputs: 'After transmission', 
                expectedOutputs: 'tx_done=1 for one cycle, tx_active=0, tx_line=1', 
                explanation: 'Completion indicators and idle state' 
              }
            ],
            hints: [
              'Use an FSM with states for IDLE, START_BIT, DATA_BITS, STOP_BIT',
              'Use a counter to track which bit is being transmitted',
              'Set tx_line to 0 for start bit, tx_data[bit_index] for data bits, and 1 for stop bit',
              'Pulse tx_done for one clock cycle after the stop bit is transmitted',
              'Set tx_active high during the entire transmission process'
            ],
            resources: [
              {
                title: "UART Protocol Fundamentals",
                description: "Comprehensive guide to UART communication protocol",
                type: "Article",
                url: "https://www.analog.com/en/analog-dialogue/articles/uart-a-hardware-communication-protocol.html",
                imageUrl: "https://www.analog.com/-/media/images/analog-dialogue/en/volume-54/number-4/articles/uart-a-hardware-communication-protocol/335462-fig-02.png?la=en&imgver=3"
              },
              {
                title: "UART Transmitter Implementation",
                description: "Step-by-step tutorial for implementing a UART transmitter in Verilog",
                type: "Tutorial",
                url: "https://www.fpga4student.com/2017/09/verilog-code-for-uart-transmitter-receiver.html",
                imageUrl: "https://www.circuitbasics.com/wp-content/uploads/2016/01/Introduction-to-UART-Data-Transmission-Diagram.png"
              },
              {
                title: "UART Waveform Analyzer",
                description: "Interactive tool for analyzing UART transmission waveforms",
                type: "Tool",
                url: "https://www.saleae.com/",
                imageUrl: "https://eewiki.net/download/attachments/25264970/uart-architecture.png?version=1"
              }
            ]
          };
          break;
          
        default:
          initialCode = 
`module module_name(
  // Define your inputs and outputs here
);
  // Implement your logic here
  
  
endmodule`;
          exerciseInfo = {
            title: 'Custom Module',
            background: 'Design a digital logic module based on your requirements.',
            requirements: 'Implement the functionality needed for your specific application.',
            hints: [
              'Start by defining the inputs and outputs of your module',
              'Determine whether you need combinational or sequential logic',
              'Break down complex problems into smaller, manageable parts',
              'Test your implementation with various input combinations'
            ],
            resources: [
              {
                title: "Verilog HDL Design Guide",
                description: "Comprehensive guide to Verilog design practices",
                type: "Article",
                url: "https://www.chipverify.com/verilog/verilog-introduction",
                imageUrl: "https://www.chipverify.com/images/verilog/verilog_modules.png"
              },
              {
                title: "Digital Design Best Practices",
                description: "Tips and techniques for effective digital circuit design",
                type: "Tutorial",
                url: "https://www.asic-world.com/verilog/veritut.html",
                imageUrl: "https://www.asic-world.com/images/verilog/sequential1.gif"
              },
              {
                title: "Verilog Online Simulator",
                description: "Browser-based tool for testing Verilog designs",
                type: "Tool",
                url: "https://www.edaplayground.com/",
                imageUrl: "https://i.ytimg.com/vi/ml7XBCUDf_0/maxresdefault.jpg"
              }
            ]
          };
      }
      
      setCode(initialCode);
      setExerciseData(exerciseInfo);
    };
    
    if (selectedModule) {
      fetchModuleData();
    }
  }, [selectedModule]);

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleSaveCode = () => {
    setNotification({
      open: true,
      message: 'Code saved successfully!',
      severity: 'success'
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  const handleCloseFeatureModal = () => {
    setShowFeatureModal(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setNotification({
      open: true,
      message: 'Code copied to clipboard!',
      severity: 'info'
    });
  };
  
  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedModule || 'verilog'}_code.v`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setNotification({
      open: true,
      message: 'Code downloaded successfully',
      severity: 'success'
    });
  };

  // Render resources section
  const renderResources = () => {
    if (!exerciseData?.resources?.length) return null;
    
    return (
      <List sx={{ width: '100%' }}>
        {exerciseData.resources.map((resource, index) => (
          <ListItem key={index} sx={{ 
            mb: 2, 
            display: 'block', 
            p: 0,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 1,
            '&:hover': {
              boxShadow: 3,
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }}>
            <Card sx={{ width: '100%', border: 'none', boxShadow: 'none' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {resource.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {resource.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={resource.type} 
                    color="primary" 
                    size="small"
                    icon={
                      resource.type.toLowerCase() === 'article' ? <MenuBook fontSize="small" /> :
                      resource.type.toLowerCase() === 'tutorial' ? <Code fontSize="small" /> :
                      resource.type.toLowerCase() === 'tool' ? <Construction fontSize="small" /> :
                      resource.type.toLowerCase() === 'simulation' ? <PlayArrow fontSize="small" /> :
                      <Info fontSize="small" />
                    }
                  />
                  <Button 
                    size="small" 
                    variant="outlined"
                    color="primary" 
                    href={resource.url} 
                    target="_blank"
                    endIcon={<ArrowForward />}
                  >
                    View Resource
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    );
  };

  // Feature coming soon modal
  const featureComingSoonModal = (
    <Modal
      open={showFeatureModal}
      onClose={handleCloseFeatureModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={showFeatureModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {xs: '90%', sm: '70%', md: '50%'},
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          border: '2px solid #3f51b5',
          outline: 'none',
        }}>
          <SmartToy sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Feature Coming Soon!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            We're still cracking the code to process Verilog directly in your browser.
            Our engineers are working on implementing a WebAssembly-based Verilog compiler
            to make real-time HDL development possible.
          </Typography>
          
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Construction />} label="Under Construction" color="warning" />
            <Chip icon={<Timer />} label="Coming Soon" color="info" />
            <Chip icon={<Fingerprint />} label="Cutting Edge" color="success" />
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            In the meantime, you can still write and download your Verilog code, 
            and use external tools like Icarus Verilog or EDA Playground to test it.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCloseFeatureModal}
              startIcon={<Code />}
            >
              Continue Coding
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              href="https://www.edaplayground.com/"
              target="_blank"
              startIcon={<PlayArrow />}
            >
              Try EDA Playground
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );

  // Futuristic loading effect modal
  const loadingEffectModal = (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(33,33,75,0.95) 100%)'
      }}
      open={showLoadingEffect}
    >
      <Box sx={{ position: 'relative', width: 120, height: 120, mb: 4 }}>
        <CircularProgress
          size={120}
          thickness={4}
          sx={{ 
            position: 'absolute',
            color: '#3f51b5',
          }}
        />
        <CircularProgress
          size={90}
          thickness={4}
          sx={{ 
            position: 'absolute',
            left: 15,
            top: 15,
            color: '#f50057',
            animationDuration: '3s',
          }}
        />
        <Loop 
          sx={{ 
            position: 'absolute',
            left: 42,
            top: 42,
            fontSize: 36,
            color: '#fff',
            animation: 'spin 5s linear infinite',
            '@keyframes spin': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
          }}
        />
      </Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Compiling Verilog Code
      </Typography>
      <Box sx={{ width: '80%', maxWidth: 400 }}>
        <LinearProgress color="secondary" sx={{ height: 8, borderRadius: 4 }} />
      </Box>
      <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
        Initializing WebAssembly runtime...
      </Typography>
    </Backdrop>
  );

  return (
    <Box className="container page-container">
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component={Link}
          to="/practice"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back to Practice
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {exerciseData?.title || 'Verilog Playground'}
        </Typography>
        <Chip 
          icon={<Bolt />} 
          label="BETA" 
          color="secondary" 
          size="small" 
          sx={{ ml: 2 }} 
        />
      </Box>

      {/* Coming Soon Banner */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        bgcolor: 'info.light', 
        color: 'white',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        boxShadow: 3
      }}>
        <Info sx={{ mr: 2 }} />
        <Typography variant="body1">
          <strong>Heads Up!</strong> Online Verilog compilation is coming soon! Currently, you can write and download code, but processing requires external tools.
        </Typography>
      </Paper>

      {/* Custom Module Button */}
      {selectedModule !== 'custom' && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Create />}
            onClick={() => {
              setSelectedModule('custom');
              setSearchParams({ module: 'custom' });
              setNotification({
                open: true,
                message: 'Switched to Custom Module mode',
                severity: 'info'
              });
            }}
          >
            Switch to Custom Module
          </Button>
        </Box>
      )}
      
      {/* Module Selector */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="module-selector-label">Select Module</InputLabel>
        <Select
          labelId="module-selector-label"
          id="module-selector"
          value={selectedModule}
          onChange={handleModuleChange}
          label="Select Module"
          MenuProps={{
            PaperProps: {
              style: { maxHeight: 500 }
            }
          }}
          sx={{ 
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: selectedModule === 'custom' ? 'primary.main' : 'primary.light',
              borderWidth: selectedModule === 'custom' ? 2 : 1
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            bgcolor: selectedModule === 'custom' ? 'rgba(63, 81, 181, 0.08)' : 'transparent'
          }}
        >
          {practiceModules.map((module, index) => (
            <React.Fragment key={module.id}>
              {index === 1 && <Divider />}
              <MenuItem 
                value={module.id}
                onClick={() => {
                  // Additional click handler for extra reliability
                  console.log("MenuItem clicked:", module.id);
                  setSelectedModule(module.id);
                  setSearchParams({ module: module.id });
                }}
                sx={module.isCustom ? {
                  borderBottom: '1px dashed #ccc',
                  mb: 1,
                  pb: 1,
                  backgroundColor: 'rgba(63, 81, 181, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.12)',
                  }
                } : {}}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {module.isCustom && <Create sx={{ mr: 1, fontSize: '0.9rem', color: 'primary.main' }} />}
                    <Typography>{module.name}</Typography>
                  </Box>
                  <Chip 
                    label={module.level} 
                    size="small"
                    color={
                      module.isCustom ? 'default' :
                      module.level === 'Beginner' ? 'success' :
                      module.level === 'Intermediate' ? 'warning' :
                      'error'
                    }
                    sx={{ ml: 1 }}
                  />
                </Box>
              </MenuItem>
            </React.Fragment>
          ))}
        </Select>
      </FormControl>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Panel - Exercise Info */}
        <Grid item xs={12} md={4}>
          {exerciseData && (
            <>
              {/* Background */}
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                boxShadow: 3,
                background: 'linear-gradient(to bottom, #ffffff, #f7f9fc)',
                border: '1px solid #e0e0e0',
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Background
                </Typography>
                <Typography variant="body1" paragraph>
                  {exerciseData.background}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Requirements:</strong> {exerciseData.requirements}
                </Typography>
                {exerciseData.imageUrl && (
                  <Box
                    component="img"
                    src={exerciseData.imageUrl}
                    alt={exerciseData.title}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      mt: 2,
                      borderRadius: 1,
                      boxShadow: 1,
                      border: '1px solid #e0e0e0',
                    }}
                  />
                )}
              </Paper>

              {/* Resources */}
              <Paper sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                background: 'linear-gradient(to bottom, #ffffff, #f7f9fc)',
                border: '1px solid #e0e0e0',
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Additional Resources
                </Typography>
                {renderResources()}
              </Paper>
            </>
          )}
        </Grid>

        {/* Right Panel - Code Editor and Output */}
        <Grid item xs={12} md={8}>
          {/* Code Editor Section */}
          <Paper sx={{ 
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: 3,
            background: 'linear-gradient(to bottom, #ffffff, #f7f9fc)',
            border: '1px solid #e0e0e0',
          }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Code Editor
              </Typography>
              <Box>
                <Button
                  startIcon={<ContentCopy />}
                  onClick={handleCopyCode}
                  sx={{ mr: 1 }}
                >
                  Copy
                </Button>
                <Button
                  startIcon={<Download />}
                  onClick={handleDownloadCode}
                  sx={{ mr: 1 }}
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrow />}
                  onClick={handleRunCode}
                  disabled={isCompiling}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  }}
                >
                  Run Code
                </Button>
              </Box>
            </Box>
            {/* Code Editor Component */}
            <Box sx={{ 
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 1,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -1,
                left: -1,
                right: -1,
                height: '4px',
                background: 'linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)',
                borderRadius: '2px 2px 0 0',
              },
            }}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '400px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '0 0 4px 4px',
                  lineHeight: '1.5',
                }}
                placeholder="// Write your Verilog code here"
                spellCheck="false"
              />
            </Box>
          </Paper>

          {/* Output Section */}
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            background: 'linear-gradient(to bottom, #ffffff, #f7f9fc)',
            border: '1px solid #e0e0e0',
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 3,
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '0.9rem',
                  },
                }}
              >
                <Tab label="Output" icon={<Assessment />} iconPosition="start" />
                <Tab label="Console" icon={<Terminal />} iconPosition="start" />
                <Tab label="Hints" icon={<LightbulbOutlined />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Output Content */}
            <Box role="tabpanel" hidden={tabValue !== 0}>
              <Box sx={{
                p: 2,
                bgcolor: '#1e1e1e',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#f8f9fa',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <SmartToy sx={{ fontSize: 60, color: '#3f51b5', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                  Verilog Compilation Coming Soon!
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc', maxWidth: '80%' }}>
                  We're building a powerful browser-based Verilog compiler. 
                  In the meantime, you can write your code here, download it, 
                  and compile it with external tools.
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 3, color: '#fff', borderColor: '#fff' }}
                  startIcon={<Download />}
                  onClick={handleDownloadCode}
                >
                  Download Your Code
                </Button>
              </Box>
            </Box>

            {/* Console Output */}
            <Box role="tabpanel" hidden={tabValue !== 1}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#1e1e1e',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: '#32CD32',
                  height: '300px',
                  overflow: 'auto',
                  position: 'relative',
                }}
              >
                {isTerminalTyping ? (
                  <Typography
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {terminalText}
                    <span className="cursor" style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      backgroundColor: '#32CD32',
                      animation: 'blink 1s step-end infinite',
                      marginLeft: '2px',
                      verticalAlign: 'middle',
                      '@keyframes blink': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0 },
                        '100%': { opacity: 1 },
                      },
                    }}></span>
                  </Typography>
                ) : (
                  <Typography
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {terminalText || '> Terminal ready. Click "Run" to start compilation process.'}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Hints */}
            <Box role="tabpanel" hidden={tabValue !== 2}>
              <Box sx={{
                p: 2,
                bgcolor: '#f8f9fa',
                borderRadius: 1,
                height: '300px',
                overflow: 'auto',
              }}>
                {exerciseData?.hints?.length ? (
                  <List>
                    {exerciseData.hints.map((hint, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemIcon>
                          <LightbulbOutlined sx={{ color: 'warning.main' }} />
                        </ListItemIcon>
                        <ListItemText primary={hint} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mt: 10 }}>
                    No hints available for this module.
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Feature Coming Soon Modal */}
      {featureComingSoonModal}
      
      {/* Loading Effect Modal */}
      {loadingEffectModal}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CodeEditor; 