App = {

    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
        accounts = await web3.eth.getAccounts();
        account = accounts[0];
        console.log(account);
    },

  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const hiring = await $.getJSON('Hiring.json')
      App.contracts.Hiring = TruffleContract(hiring)
      App.contracts.Hiring.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.hiring = await App.contracts.Hiring.deployed()
    },
  
    render: async () => {
      // Prevent double render

      if (App.loading) {
        return
      }
      App.setLoading(true)
        const accounts = await web3.eth.getAccounts()
      $('#account').html(accounts[0])
      App.setLoading(false)
    },
  
    // renderUsers: async () => {
    //   // Load the total task count from the blockchain
    //   const UserCount = await App.Hiring.UserCount()
    //   const $taskTemplate = $('.taskTemplate')
  
    //   // Render out each task with a new task template
    //   for (var i = 1; i <= taskCount; i++) {
    //     // Fetch the task data from the blockchain
    //     const task = await App.todoList.tasks(i)
    //     const taskId = task[0].toNumber()
    //     const taskContent = task[1]
    //     const taskCompleted = task[2]
  
    //     // Create the html for the task
    //     const $newTaskTemplate = $taskTemplate.clone()
    //     $newTaskTemplate.find('.content').html(taskContent)
    //     $newTaskTemplate.find('input')
    //                     .prop('name', taskId)
    //                     .prop('checked', taskCompleted)
    //                     .on('click', App.toggleCompleted)
  
    //     // Put the task in the correct list
    //     if (taskCompleted) {
    //       $('#completedTaskList').append($newTaskTemplate)
    //     } else {
    //       $('#taskList').append($newTaskTemplate)
    //     }
  
    //     // Show the task
    //     $newTaskTemplate.show()
    //   }
    // },
    
    // handleAdopt: function(event)
    createUser: async function () {
        App.setLoading(true);

        let name = $('#Name').val();
        let title = $('#Title').val();
        let salary = $('#Salary').val();

        await App.hiring.createUser(name, title, salary, {from: account});
        window.location.reload()
    },

    createUserAchiev: async function () {
        App.setLoading(true);

        let achName = $('#achName').val();
        let ProjName = $('#ProjName').val();
        let achValue = $('#achValue').val();
        let ProjAllocatedTime = $('#ProjAllocatedTime').val();
        let ProjCompTime = $('#ProjCompTime').val();

        await App.hiring.CreateUserAchiev(achName,ProjName, achValue, ProjAllocatedTime, ProjCompTime, {from: account});
        window.location.reload()
    },
  
    // toggleCompleted: async (e) => {
    //   App.setLoading(true)
    //   const taskId = e.target.name
    //   await App.todoList.toggleCompleted(taskId)
    //   window.location.reload()
    // },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
}


$(() => {
    $(window).load(() => {
        App.load()
    })
})
  