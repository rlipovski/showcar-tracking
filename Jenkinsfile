pipeline {
  // Execute the pipeline on the master, stages will still be executed on the agents
  agent none 

  options {
    timestamps() // Enable timestamps in the build log
    disableConcurrentBuilds() // The pipeline should run only once at a time
    preserveStashes(buildCount: 5)
  }

  // Environment variables for all stages
  environment {
    AWS_DEFAULT_REGION="eu-west-1"
    SERVICE="brave-flamingo"
    // USECASE="showcar-tracking"
    // SEGMENT="cxp"
    // TEAM="acquisition"
    // VERTICAL="as24"
  }

  stages {
    stage('Build') {
      when {
        beforeAgent true
        branch 'master'
      }

      agent { node { label 'deploy-as24dev-node' } }

      steps {
        sh './build.sh'
        stash includes: 'dist/**/*', name: 'output-dist'
      }
    }

    stage('DeployDev') {
      when {
        beforeAgent true
        branch 'master'
      }

      environment {
        BRANCH="develop"
      }

      agent { node { label 'deploy-as24dev-node' } }

      steps {
        unstash 'output-dist'
        sh './deploy.sh'
      }
    }

    stage('DeployProd') {
      when {
        beforeAgent true
        branch 'master'
      }

      environment {
        BRANCH="master"
      }

      agent { node { label 'deploy-as24dev-node' } }

      steps {
        unstash 'output-dist'
        sh './deploy.sh'
      }
    }

    post { 
      failure { 
          echo 'Pipeline failed 💣''
      }
    }
  }
}
