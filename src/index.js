const populatePeerInfos = (data) => {
  const peerInfos = document.getElementById("peer_infos")
  Object.entries(data).forEach(([k,v]) => {
    v.quorumSets = v.quorumSets || []
    const html =  `
      <li>
        ${
          k
        }:
        <ul>
          <li>
          ${
            v.quorumSets.join("</li><li>")
          }
          </li>
        </ul>
      </li>
    `
    peerInfos.insertAdjacentHTML("beforeend",html);
  })
}

const iterateValidators = (quorum, f) => {
  quorum.validators.forEach( _ => f(quorum.validators))
  quorum.inner_sets.forEach( s => iterateValidators(s, f))
}

// TODO it would be much better if we still had the qset-hash..
const addQuorumSet = (node, quorumSet) => {
  node.quorumSets = node.quorumSets || []
  quorumSet.sort()
  const qsId = quorumSet.join("")
  if (!node.quorumSets.find((qs) => qs.join("") === qsId)) {
    node.quorumSets.push(quorumSet)
  }
}

const peerInfosPromise = fetch('data/peer_infos.json')
  .then(response => response.json());

const quorumsPromise = fetch('data/quorums.json')
  .then(response => response.json());

Promise.all([peerInfosPromise, quorumsPromise]).then(([peerInfos, quorums]) => {
  console.log("Starting data processing")
  Object.entries(quorums).forEach(([k,v]) => {
    v.forEach( q => {
      iterateValidators(q, (validators) => {
        validators.forEach(validator => {
          peerInfos[validator] = peerInfos[validator] || {}
          addQuorumSet(peerInfos[validator], validators)
        })
      })
    })
  })
  console.log("Finished data processing")
  populatePeerInfos(peerInfos)
})
