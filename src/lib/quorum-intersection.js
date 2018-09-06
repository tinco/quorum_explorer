// quorumIntersection calculates intersection information for a given stellar
// network. Nodes should be a hash of id to quorumset.
// The stellar core network functions correctly when there is a cluster of
// quorum slices for which each quorum slice has at least one node in common with
// each other quorum slice and everyone we want to do business with trusts only
// nodes that are in that cluster.

// there may be multiple clusters in the network, or in other words, there may
// be an amount of nodes that have configured a quorum set that does not overlap
// with every other quorum set.

// We can find at least one largest quorum, all quorum slices that partake in the quorum
// will be configured correctly. We could also find the top N largest quorums.
// Their differences might show ways to strengthen the network.

export function quorumIntersection(nodes) {
  prepareSlices(Object.values(nodes)).then( allSlices => {
    // TODO this tracks only the top quorum, we could/should find more to find out
    // more about the health of the network
    const topQuorum = []
    const trackQuorum = (q) => {
      if (q.length > topQuorum.length) {
        console.log("Found better quorum: " + q.join(","))
        topQuorum = q
      }
    }

    // For each slice we start an exploration of the network. This should visit
    // all paths through the quorumslices. It has a pretty bad worst case complexity
    // (something like O(N^N) for N quorumslices) but real world performance should be
    // ok due to connectedness being relatively low.
    // TODO fixxpoint's quorum intersection tool first splits the nodes into clusters
    // of strongly connected components, this might be useful as well.
    Object.values(allSlices).forEach((sliceGuess) => {
      exploreIntersection(allSlices, trackQuorum, [sliceGuess.hash])
    })
  })
}

// A naieve approach will be to simply for each quorumSlice, see what other
// slices it intersects with, and then, for each of those intersecting slices
// find out whether it intersects with any they both intersect with. And so
// on until it finds no further intersections
const exploreIntersection = (allSlices, trackQuorum, hashes) => {
  const possibilities = intersectionPossibilities(allSlices, hashes)
  if (possibilities.length == 0) {
    // register end of exploration branch and return
    trackQuorum(hashes)
    return
  } else {
    // please dont make me rewrite this into non-recursive :(
    possibilities.forEach(p => exploreIntersection(allSlices, trackQuorum, hashes.concat([p.hash])))
  }
}

// intersectionPossibilities returns a list of next possible expansions for
// the current set of slices by their hashes
// each expansion is a tuple of the next currentSliceHashes and the new intersections
const intersectionPossibilities = (allSlices, currentSlices) => {
  // we expand from the last added slice
  const nextSlice = allSlices[currentSlices[currentSlices.length - 1]]
  // candidate slices are those slices referenced by then nodes in the quorum of the
  // next hash that we have not yet added to the currentSlicesHashes
  const nextReferencedSlices = nextSlice.map(node => node.quorumSetHash)
  const candidateSlices = _.difference(nextReferencedSlices, currentSlices)

  // candidate slices are viable if they have at least one node in common with each
  // of our current slices
  return candidateSlices
    .map(h => allSlices[h])
    .filter(candidate => currentSlices.every(h => _.intersection(allSlices[h], candidate).length > 0))
}


//NOTE this has a subtle flaw/vulnerability where we don't include threshold or
// even nesting in the qset hash, unclear if it might be gamed.
const quorumSetHash = (flattenedQuorum) => sha256(flattenedQuorum.join(""))

const flattenQuorum = (q) => {
  if (q.flattened) { return q.flattened }
  const rest = Array.prototype.concat.apply([], q.inner_sets.map(s => flattenQuorum(s)))
  q.flattened = Array.prototype.concat.apply(q.validators, rest).sort()
  return q.flattened
}

const prepareNode = (nodes, n) => {
  n.flattenedQuorum = flattenQuorum(n.quorum).map(id => nodes[id])
  return quorumSetHash(n.flattenedQuorum).then(h => n.quorumSetHash = n.flattenedQuorum.hash = h)
}

const prepareSlices = (nodes) => {
  const allSlices = {}
  // To help us find quorums quickly we cache a flattened quorum slice for each node
  const promises = Object.values(nodes).map((n) =>
    prepareNode(nodes, n).then(() => allSlices[n.quorumSetHash] = n.flattenedQuorum)
  )
  return Promise.all(promises).then(() => allSlices)
}

// UTILITIES
function sha256(str) {
  const buffer = new TextEncoder("utf-8").encode(str)
  return crypto.subtle.digest("SHA-256", buffer).then(hash => hex(hash))
}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16)
    // We use concatenation and slice for padding
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
}

// TESTS

const tests = {
  flattenQuorum: () => {
    const q = {
      validators: [1, 2, 3],
      inner_sets: [
        { inner_sets: [], validators: [4, 5] },
        { inner_sets: [], validators: [6] },
        { inner_sets: [{ inner_sets: [], validators: [8, 9] }], validators: [7] }
      ]
    }
    const ex = [1,2,3,4,5,6,7,8,9]
    const res = flattenQuorum(q)
    console.assert(_.isEqual(ex, res), "flattenQuorum is not working", res, ex)
  },
  intersectionPossibilities: () => {
    // it takes two arguments, all slices, and an array of hashes it's going to
    // test the next candidate quorum slices for intersections with

    // if we have 2 quorumslices that intersect, when given the first quorum it
    // should give us the second.
    const node1 = { quorum: { validators: [1,2], inner_sets: [] } }
    const node2 = { quorum: { validators: [1,2,3], inner_sets: [] } }
    const node3 = { quorum: { validators: [3], inner_sets: [] }}

    let nodes = { 1: node1, 2: node2, 3: node3}

    prepareSlices(nodes).then( allSlices => {
      let result = intersectionPossibilities(allSlices, [node1.quorumSetHash])
      console.assert(result[0].hash == node2.quorumSetHash,
         "intersectionPossibilities finds a match", result)

      console.log("tested intersectionPossibilities")
    })
  },
  exploreIntersection: () => {
    // it takes three arguments, all slices, an end of branch tracker function
    // and an array of hashes that represents the current branch it is exploring
    const node1 = { quorum: { validators: [1,2], inner_sets: [] } }
    const node2 = { quorum: { validators: [1,2,3], inner_sets: [] } }
    const node3 = { quorum: { validators: [3], inner_sets: [] }}

    let nodes = { 1: node1, 2: node2, 3: node3}

    prepareSlices(nodes).then( allSlices => {
      let result = null
      const trackQuorum = (q) => console.log(q)
      exploreIntersection(allSlices, trackQuorum, [node1.quorumSetHash])
      console.log("tested exploreIntersection")
    })
  }

}

window.testQuorumIntersection = () => {
  Object.values(tests).forEach(t => t())
}

testQuorumIntersection()
