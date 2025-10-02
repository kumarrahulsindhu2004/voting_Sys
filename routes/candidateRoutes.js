import e from "express";
import { User } from "../models/user.js";        // for role check
import { Candidate } from "../models/candidate.js"; // for storing candidates
import { jwtAuthMiddleware } from "../jwt.js";

const route = e.Router();

// helper: check if user has admin role
const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user && user.role === "admin";
  } catch (error) {
    return false;
  }
};

// POST route -> add a candidate (only admin can do this)
route.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      console.log("admin log not found");
      return res.status(403).json({ message: "user has not admin role" });
    }

    console.log("admin role found");
    const data = req.body;
    const newCandidate = new Candidate(data);   // ✅ use Candidate model
    const response = await newCandidate.save();

    console.log("candidate saved");
    res.status(201).json({ candidate: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT route -> update a candidate
route.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user has not admin role" });

    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      { new: true, runValidators: true }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate data updated");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE route -> delete a candidate
route.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user has not admin role" });

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID); // ✅ correct method

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate deleted");
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// let's start voting

route.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
  const candidateID = req.params.candidateID;
  const userId = req.user.id;

  try {
    // Find candidate
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent multiple votes
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Prevent admin from voting
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin is not allowed to vote" });
    }

    // Record vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // Mark user as voted
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get('/',async(req,res)=>{
  try {
    const candidate = await Candidate.find().sort({voteCount:'desc'})
    const voteRecord = candidate.map((data)=>{
      return {
        party:data.party,
        count:data.voteCount
      }
    })
    return res.status(200).json(voteRecord)
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'Internal Server Error'})
    
  }
})


route.get('/list', async (req, res) => {
  try {
    const candidates = await Candidate.find({}, 'name party -_id');
        res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default route;
